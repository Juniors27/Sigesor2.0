from rest_framework import serializers
from sigesor.models import Procedimiento

class ProcedimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Procedimiento
        fields = ['id', 'cod_prestacion', 'nombre_prestacion', 'cantidad']


class ProcedimientoConFUASerializer(serializers.ModelSerializer):
    """Serializer para crear/actualizar procedimientos con referencia a FUA"""
    class Meta:
        model = Procedimiento
        fields = ['id', 'cod_prestacion', 'nombre_prestacion', 'cantidad', 'fua']