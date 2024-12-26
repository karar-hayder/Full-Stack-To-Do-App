from django.db.models.manager import QuerySet
from rest_framework import viewsets, permissions, status
from .models import Todo
from .serializers import TodoSerializer


# Create your views here.


class TodoView(viewsets.ModelViewSet):
    serializer_class = TodoSerializer
    queryset = Todo.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self) -> QuerySet[Todo]:
        filter_by = self.request.query_params.getlist("filter_by", [])
        if len(filter_by) > 0:
            return Todo.objects.filter(user=self.request.user).order_by(
                *filter_by if filter_by else "-created_at"
            )

        return Todo.objects.filter(user=self.request.user)
