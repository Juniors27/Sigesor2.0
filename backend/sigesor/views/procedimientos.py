# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from django.db.models import Q
from sigesor.models import Procedimiento,FUA
from sigesor.serializers.procedimientos import ProcedimientoSerializer

class ProcedimientosPorFUAView(APIView):
    """
    Vista para obtener y actualizar procedimientos filtrados por FUA
    URL: /api/procedimientos/fua/
    GET: ?renipress=5196&lote=25&numero=00002345
    POST: actualizar procedimientos
    """
    
    def get(self, request):
        # Obtener parámetros de la URL
        renipress = request.query_params.get('renipress')
        lote = request.query_params.get('lote')
        numero = request.query_params.get('numero')
        
        # Validar que al menos un parámetro esté presente
        if not any([renipress, lote, numero]):
            return Response([], status=status.HTTP_200_OK)
        
        # Construir filtros
        fua_filters = Q()
        if renipress:
            fua_filters &= Q(fua__renipress=renipress)
        if lote:
            fua_filters &= Q(fua__lote=lote)
        if numero:
            numero_sin_ceros = numero.lstrip('0') or '0'
            fua_filters &= (
                Q(fua__numero=numero) |
                Q(fua__numero=numero.zfill(8)) |
                Q(fua__numero__endswith=numero_sin_ceros)
            )
        
        # Obtener procedimientos
        procedimientos = Procedimiento.objects.filter(fua_filters).select_related('fua')
        
        # Serializar y devolver
        serializer = ProcedimientoSerializer(procedimientos, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        """
        Actualizar procedimientos para un FUA específico
        Esperado en request.data:
        {
            "fua_renipress": "5196",
            "fua_lote": "25", 
            "fua_numero": "00001526",
            "procedimientos": [
                {
                    "id": 1,
                    "cod_prestacion": "90001",
                    "nombre_prestacion": "Consulta externa",
                    "cantidad": 1,
                    "isNew": false,
                    "modified": true
                }
            ]
        }
        """
        try:
            # Obtener datos del request
            fua_renipress = request.data.get('fua_renipress')
            fua_lote = request.data.get('fua_lote')
            fua_numero = request.data.get('fua_numero')
            procedimientos_data = request.data.get('procedimientos', [])
            
            # Validar datos requeridos
            if not all([fua_renipress, fua_lote, fua_numero]):
                return Response(
                    {"error": "Se requieren fua_renipress, fua_lote y fua_numero"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Buscar el FUA - Mejorar la búsqueda para manejar números con/sin ceros
            try:
                # Normalizar el número para la búsqueda
                numero_normalizado = fua_numero.zfill(8)
                numero_sin_ceros = fua_numero.lstrip('0') or '0'
                
                fua = FUA.objects.filter(
                    renipress=fua_renipress,
                    lote=fua_lote
                ).filter(
                    Q(numero=fua_numero) |
                    Q(numero=numero_normalizado) |
                    Q(numero__endswith=numero_sin_ceros)
                ).first()
                
                if not fua:
                    return Response(
                        {"error": f"FUA no encontrado: {fua_renipress}-{fua_lote}-{fua_numero}"}, 
                        status=status.HTTP_404_NOT_FOUND
                    )
                    
            except Exception as e:
                return Response(
                    {"error": f"Error al buscar FUA: {str(e)}"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Usar transacción para mantener consistencia
            with transaction.atomic():
                # Obtener IDs de procedimientos actuales para este FUA
                procedimientos_actuales = list(
                    Procedimiento.objects.filter(fua=fua).values_list('id', flat=True)
                )
                
                # IDs de procedimientos que se van a conservar/actualizar
                procedimientos_conservar = []
                
                # Procesar cada procedimiento
                for proc_data in procedimientos_data:
                    # Validar campos requeridos
                    if not proc_data.get('cod_prestacion') or not proc_data.get('nombre_prestacion'):
                        continue
                    
                    if proc_data.get('id') and not proc_data.get('isNew'):
                        # Actualizar procedimiento existente
                        try:
                            procedimiento = Procedimiento.objects.get(
                                id=proc_data['id'], 
                                fua=fua
                            )
                            procedimiento.cod_prestacion = proc_data.get('cod_prestacion', procedimiento.cod_prestacion)
                            procedimiento.nombre_prestacion = proc_data.get('nombre_prestacion', procedimiento.nombre_prestacion)
                            procedimiento.cantidad = max(1, int(proc_data.get('cantidad', 1)))  # Asegurar cantidad positiva
                            procedimiento.save()
                            procedimientos_conservar.append(procedimiento.id)
                        except (Procedimiento.DoesNotExist, ValueError):
                            continue
                    else:
                        # Crear nuevo procedimiento
                        try:
                            nuevo_procedimiento = Procedimiento.objects.create(
                                fua=fua,
                                cod_prestacion=proc_data.get('cod_prestacion', ''),
                                nombre_prestacion=proc_data.get('nombre_prestacion', ''),
                                cantidad=max(1, int(proc_data.get('cantidad', 1)))
                            )
                            procedimientos_conservar.append(nuevo_procedimiento.id)
                        except ValueError:
                            continue
                
                # Eliminar procedimientos que no están en la lista
                procedimientos_a_eliminar = set(procedimientos_actuales) - set(procedimientos_conservar)
                if procedimientos_a_eliminar:
                    Procedimiento.objects.filter(id__in=procedimientos_a_eliminar).delete()
            
            # Devolver los procedimientos actualizados
            procedimientos_actualizados = Procedimiento.objects.filter(fua=fua).order_by('id')
            serializer = ProcedimientoSerializer(procedimientos_actualizados, many=True)
            
            return Response({
                "message": "Procedimientos actualizados correctamente",
                "procedimientos": serializer.data,
                "fua_info": {
                    "renipress": fua.renipress,
                    "lote": fua.lote,
                    "numero": fua.numero,
                    "numero_completo": fua.numero_completo()
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {"error": f"Error interno del servidor: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )