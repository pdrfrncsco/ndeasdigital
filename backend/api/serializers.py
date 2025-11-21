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
