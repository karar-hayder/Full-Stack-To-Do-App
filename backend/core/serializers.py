from .models import Todo
from rest_framework import serializers


class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = "__all__"
        read_only_fields = ["user"]

    def create(self, validated_data):
        user = self.context["request"].user
        todo = Todo.objects.create(user=user, **validated_data)
        return todo
