# sigesor/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from django.db.models import Count,Q
from rest_framework.generics import RetrieveUpdateDestroyAPIView
#from rest_framework.permissions import IsAuthenticated
#from rest_framework_simplejwt.authentication import JWTAuthentication
from datetime import datetime
from django.db.models.functions import TruncDate, TruncMonth, ExtractYear, ExtractMonth
from sigesor.serializers.fua import FUASerializer,FuaEstadoSerializer, FUAListSerializer
from sigesor.models import FUA

class BaseFUAListView(generics.ListAPIView):
    serializer_class = FUAListSerializer
    tipo_fua = None  # Será definido en las clases hijas

    def get_queryset(self):
        if not self.tipo_fua:
            return FUA.objects.none()
            
        queryset = FUA.objects.filter(tipo_fua=self.tipo_fua).select_related('asegurado')
        return self._aplicar_filtros_comunes(queryset)
    
    def _aplicar_filtros_comunes(self, queryset):
        """Método para aplicar filtros comunes a todos los tipos de FUA"""
        renipress = self.request.query_params.get('renipress')
        lote = self.request.query_params.get('lote')
        numero = self.request.query_params.get('numero')
        mes_anio = self.request.query_params.get('mes_anio')
        fecha_inicio = self.request.query_params.get('fecha_inicio')
        fecha_fin = self.request.query_params.get('fecha_fin')
        
        # Filtro por N° de FUA (renipress, lote, numero)
        if renipress:
            queryset = queryset.filter(renipress=renipress)
        if lote:
            queryset = queryset.filter(lote=lote)
        if numero:
            numero_sin_ceros = numero.lstrip('0') or '0'
            
            queryset = queryset.filter(
                Q(numero=numero) |
                Q(numero=numero.zfill(8)) |
                Q(numero__endswith=numero_sin_ceros) |
                Q(numero__icontains=numero_sin_ceros)
            )
            
        # Filtro por mes y año del formato
        if mes_anio:
            try:
                mes, anio_corto = mes_anio.split('/')
                anio = 2000 + int(anio_corto)
                mes = int(mes)
                
                queryset = queryset.filter(
                    fecha_atencion__year=anio,
                    fecha_atencion__month=mes
                )
            except (ValueError, AttributeError):
                pass
                
        # Filtro por rango de fechas de atención
        if fecha_inicio and fecha_fin:
            try:
                inicio = datetime.strptime(fecha_inicio, '%Y-%m-%d').date()
                fin = datetime.strptime(fecha_fin, '%Y-%m-%d').date()
                
                queryset = queryset.filter(
                    fecha_atencion__gte=inicio,
                    fecha_atencion__lte=fin
                )
            except ValueError:
                pass
        
        return queryset


# Vistas específicas para cada tipo
class FUAsExtemporaneosView(BaseFUAListView):
    tipo_fua = 'extemporaneo'


class FUAsObservadosView(BaseFUAListView):
    tipo_fua = 'observado'


# Vistas específicas para fechas disponibles
class FechasDisponiblesExtemporaneosView(APIView):
    def get(self, request):
        # Obtener fechas únicas y contar FUAs por mes/año para extemporáneos
        fechas_count = (
            FUA.objects.filter(tipo_fua='extemporaneo')
            .annotate(
                mes=TruncMonth('fecha_atencion'),
                anio=ExtractYear('fecha_atencion'),
                mes_num=ExtractMonth('fecha_atencion')
            )
            .values('fecha_atencion','mes', 'anio', 'mes_num')
            .annotate(count=Count('id'))
            .order_by('-anio', '-mes_num')
        )
        
        # Formatear la respuesta
        resultado = []
        for item in fechas_count:
            fecha_str = f"{item['anio']}-{item['mes_num']:02d}-01"
            resultado.append({
                "fecha": fecha_str,
                "count": item['count']
            })
            
        return Response(resultado)


class FechasDisponiblesObservadosView(APIView):
    def get(self, request):
        # Obtener fechas únicas y contar FUAs por mes/año para observados
        fechas_count = (
            FUA.objects.filter(tipo_fua='observado')
            .annotate(
                mes=TruncMonth('fecha_atencion'),
                anio=ExtractYear('fecha_atencion'),
                mes_num=ExtractMonth('fecha_atencion')
            )
            .values('fecha_atencion','mes', 'anio', 'mes_num')
            .annotate(count=Count('id'))
            .order_by('-anio', '-mes_num')
        )
        
        # Formatear la respuesta
        resultado = []
        for item in fechas_count:
            fecha_str = f"{item['anio']}-{item['mes_num']:02d}-01"
            resultado.append({
                "fecha": fecha_str,
                "count": item['count']
            })
            
        return Response(resultado)


# Vistas que no cambian
class FUARegistroView(APIView):
    def post(self, request):
        serializer = FUASerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FUAByIdView(RetrieveUpdateDestroyAPIView):
    #queryset = FUA.objects.all()
    serializer_class = FUASerializer
    lookup_field = 'id'    

    def get_queryset(self):
        """Cargar el FUA con todas sus relaciones"""
        return FUA.objects.select_related('asegurado').prefetch_related('procedimientos')

class FuaEstadoUpdateView(generics.UpdateAPIView):
    queryset = FUA.objects.all()
    serializer_class = FUASerializer   
    lookup_field = 'id'
