from django.contrib import admin
from .models import Part, PriceHistory, Quote, QuoteLineItem


class PriceHistoryInline(admin.TabularInline):
    model = PriceHistory
    extra = 0
    readonly_fields = ['old_price', 'new_price', 'reason', 'changed_at']
    can_delete = False


@admin.register(Part)
class PartAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'current_price', 'sku', 'supplier']
    inlines = [PriceHistoryInline]


class LineItemInline(admin.TabularInline):
    model = QuoteLineItem
    extra = 0
    readonly_fields = ['part_name', 'unit_price', 'quantity', 'line_total']
    can_delete = False


@admin.register(Quote)
class QuoteAdmin(admin.ModelAdmin):
    list_display = ['id', 'created_at', 'total', 'margin_pct']
    inlines = [LineItemInline]