# En tu views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count, Q
from sigesor.models import FUA  
from sigesor.serializers.dashboard import DashboardStatsSerializer

@api_view(['GET'])
def dashboard_stats(request):
    """
    Endpoint para obtener las estadísticas del dashboard
    """
    try:
        # Contar por tipo_fua
        extemporaneos = FUA.objects.filter(tipo_fua='extemporaneo').count()
        observados = FUA.objects.filter(tipo_fua='observado').count()
        
        # Contar por tipo de auditoría (ajusta los nombres según tu BD)
        reconsideracion = FUA.objects.filter(tipo_auditoria='reconsideracion').count()
        pcpp = FUA.objects.filter(tipo_auditoria='pcpp').count()
        fissal = FUA.objects.filter(tipo_auditoria='fissal').count()
        
        # Crear el diccionario con los datos
        stats_data = {
            'extemporaneos': extemporaneos,
            'observados': observados,
            'reconsideracion': reconsideracion,
            'pcpp': pcpp,
            'fissal': fissal,
        }
        
        # Serializar los datos
        serializer = DashboardStatsSerializer(data=stats_data)
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        return Response(
            {'error': f'Error al obtener estadísticas: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )