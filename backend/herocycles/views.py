from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from decimal import Decimal, ROUND_HALF_UP
from .models import Part, Quote, QuoteLineItem
from .serializers import PartSerializer, UpdatePriceSerializer, QuoteSerializer


class PartViewSet(viewsets.ModelViewSet):
    serializer_class = PartSerializer

    def get_queryset(self):
        return Part.objects.filter(is_active=True).prefetch_related('price_history')

    def destroy(self, request, *args, **kwargs):
        part = self.get_object()
        part.is_active = False
        part.save()
        return Response({'detail': 'Part deactivated.'})

    @action(detail=True, methods=['post'], url_path='update-price')
    def update_price(self, request, pk=None):
        part = self.get_object()
        serializer = UpdatePriceSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        part.update_price(
            new_price=serializer.validated_data['new_price'],
            reason=serializer.validated_data.get('reason', '')
        )
        return Response(PartSerializer(part).data)


class QuoteViewSet(viewsets.ModelViewSet):
    serializer_class = QuoteSerializer
    queryset = Quote.objects.all().prefetch_related('line_items')
    http_method_names = ['get', 'post']

    def create(self, request, *args, **kwargs):
        line_item_inputs = request.data.get('line_items', [])
        margin_pct = Decimal(str(request.data.get('margin_pct', 0)))
        notes = request.data.get('notes', '')

        if not line_item_inputs:
            return Response({'detail': 'Add at least one part.'}, status=status.HTTP_400_BAD_REQUEST)

        subtotal = Decimal('0')
        resolved = []

        for item in line_item_inputs:
            try:
                part = Part.objects.get(id=item['part_id'], is_active=True)
            except Part.DoesNotExist:
                return Response({'detail': f"Part {item['part_id']} not found."}, status=400)

            qty = int(item['quantity'])
            line_total = part.current_price * qty
            subtotal += line_total
            resolved.append({'part': part, 'part_name': part.name, 'part_category': part.category,
                              'unit_price': part.current_price, 'quantity': qty, 'line_total': line_total})

        margin_amount = (subtotal * margin_pct / 100).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        total = subtotal + margin_amount

        quote = Quote.objects.create(
            id=Quote.generate_id(),
            subtotal=subtotal, margin_pct=margin_pct,
            margin_amount=margin_amount, total=total, notes=notes
        )
        for item in resolved:
            QuoteLineItem.objects.create(quote=quote, **item)

        return Response(QuoteSerializer(quote).data, status=status.HTTP_201_CREATED)