from django.urls import path
from .views import ProcessPDFView

urlpatterns = [
    path('upload/', ProcessPDFView.as_view(), name='process_pdf'),
]
