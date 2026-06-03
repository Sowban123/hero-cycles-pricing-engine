from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PartViewSet, QuoteViewSet

router = DefaultRouter()
router.register(r'parts', PartViewSet, basename='part')
router.register(r'quotes', QuoteViewSet, basename='quote')

urlpatterns = [
    path('api/', include(router.urls)),
]