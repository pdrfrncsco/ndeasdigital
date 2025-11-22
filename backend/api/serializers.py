from rest_framework import serializers


class BudgetSerializer(serializers.Serializer):
    name = serializers.CharField()
    email = serializers.EmailField()
    phone = serializers.CharField()
    system_type = serializers.CharField(required=False, allow_blank=True)
    platforms = serializers.ListField(child=serializers.CharField(), required=False)
    features = serializers.ListField(child=serializers.CharField(), required=False)
    domain = serializers.CharField(required=False, allow_blank=True)
    hosting = serializers.CharField(required=False, allow_blank=True)
    support = serializers.BooleanField(required=False)


class ContactSerializer(serializers.Serializer):
    name = serializers.CharField()
    email = serializers.EmailField()
    phone = serializers.CharField(required=False, allow_blank=True)
    subject = serializers.CharField()
    message = serializers.CharField()


class InvoiceSerializer(serializers.Serializer):
    client = serializers.DictField(child=serializers.CharField())
    items = serializers.ListField(child=serializers.DictField())


class ProjectSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    slug = serializers.CharField(read_only=True)
    title = serializers.CharField()
    category = serializers.CharField(allow_blank=True)
    description = serializers.CharField()
    tags = serializers.ListField(child=serializers.CharField(), required=False)
    img = serializers.CharField(allow_blank=True)
    link = serializers.CharField(allow_blank=True)
    gallery = serializers.ListField(child=serializers.CharField(), required=False)
    client_name = serializers.CharField(allow_blank=True)
    featured = serializers.BooleanField(required=False)
