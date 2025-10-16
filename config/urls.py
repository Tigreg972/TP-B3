from django.contrib import admin
from django.urls import path
from ninja import NinjaAPI
from students.api import router as students_router
from blackjack.api import router as blackjack_router  

api = NinjaAPI()
api.add_router("/students", students_router)
api.add_router("/blackjack", blackjack_router)       

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", api.urls),  # /api/docs
]
