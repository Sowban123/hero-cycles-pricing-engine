from rest_framework import serializers
from .models import Part, PriceHistory, Quote, QuoteLineItem
from decimal import Decimal, ROUND_HALF_UP


class PriceHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PriceHistory
        fields = ['old_price', 'new_price', 'reason', 'changed_at']


class PartSerializer(serializers.ModelSerializer):
    price_history = PriceHistorySerializer(many=True, read_only=True)

    class Meta:
        model = Part
        fields = ['id', 'name', 'category', 'current_price', 'sku', 'supplier', 'is_active', 'price_history']


class UpdatePriceSerializer(serializers.Serializer):
    new_price = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=Decimal('0.01'))
    reason = serializers.CharField(max_length=500, required=False, default='')


class QuoteLineItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuoteLineItem
        fields = ['part_name', 'part_category', 'unit_price', 'quantity', 'line_total']


class QuoteSerializer(serializers.ModelSerializer):
    line_items = QuoteLineItemSerializer(many=True, read_only=True)

    class Meta:
        model = Quote
        fields = ['id', 'created_at', 'subtotal', 'margin_pct', 'margin_amount', 'total', 'notes', 'line_items']