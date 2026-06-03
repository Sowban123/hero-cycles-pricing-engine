
from django.db import models
import uuid


class Part(models.Model):
    CATEGORY_CHOICES = [
        ('Frame', 'Frame'),
        ('Gear Set', 'Gear Set'),
        ('Tyre', 'Tyre'),
        ('Brakes', 'Brakes'),
        ('Other', 'Other'),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    current_price = models.DecimalField(max_digits=10, decimal_places=2)
    sku = models.CharField(max_length=100, blank=True)
    supplier = models.CharField(max_length=200, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    def update_price(self, new_price, reason=''):
        PriceHistory.objects.create(
            part=self,
            old_price=self.current_price,
            new_price=new_price,
            reason=reason
        )
        self.current_price = new_price
        self.save()


class PriceHistory(models.Model):
    part = models.ForeignKey(Part, on_delete=models.CASCADE, related_name='price_history')
    old_price = models.DecimalField(max_digits=10, decimal_places=2)
    new_price = models.DecimalField(max_digits=10, decimal_places=2)
    reason = models.CharField(max_length=500, blank=True)
    changed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.part.name}: {self.old_price} → {self.new_price}"


class Quote(models.Model):
    id = models.CharField(max_length=20, primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)
    margin_pct = models.DecimalField(max_digits=5, decimal_places=2)
    margin_amount = models.DecimalField(max_digits=12, decimal_places=2)
    total = models.DecimalField(max_digits=12, decimal_places=2)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.id} — ₹{self.total}"

    @classmethod
    def generate_id(cls):
        last = cls.objects.order_by('-created_at').first()
        if not last:
            return 'Q-1001'
        try:
            num = int(last.id.split('-')[1]) + 1
        except (IndexError, ValueError):
            num = 1001
        return f'Q-{num}'


class QuoteLineItem(models.Model):
    quote = models.ForeignKey(Quote, on_delete=models.CASCADE, related_name='line_items')
    part = models.ForeignKey(Part, null=True, blank=True, on_delete=models.SET_NULL)
    part_name = models.CharField(max_length=200)
    part_category = models.CharField(max_length=50)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    line_total = models.DecimalField(max_digits=12, decimal_places=2)

    def save(self, *args, **kwargs):
        self.line_total = self.unit_price * self.quantity
        super().save(*args, **kwargs)