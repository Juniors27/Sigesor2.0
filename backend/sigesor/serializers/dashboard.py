# En tu serializers.py
from rest_framework import serializers

class DashboardStatsSerializer(serializers.Serializer):
    """
    Serializer para las estadísticas del dashboard
    """
    # Estadísticas por tipo_fua
    extemporaneos = serializers.IntegerField()
    observados = serializers.IntegerField()
    
    # Estadísticas por tipo de auditoría
    reconsideracion = serializers.IntegerField()
    pcpp = serializers.IntegerField()
    fissal = serializers.IntegerField()
    
    class Meta:
        fields = ['extemporaneos', 'observados', 'reconsideracion', 'pcpp', 'fissal']