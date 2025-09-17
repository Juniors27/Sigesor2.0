from datetime import date
from rest_framework import serializers
from sigesor.models import FUA, Asegurado, Procedimiento, Usuario

class AseguradoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asegurado
        fields = ['codigo_fijo', 'cod_afiliacion', 'dni', 'historia_clinica']

class ProcedimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Procedimiento
        fields = ['cod_prestacion', 'nombre_prestacion', 'cantidad']
        
#lista los fuas en bandeja de extemporaneos
class FUAListSerializer(serializers.ModelSerializer):
    asegurado = AseguradoSerializer()

    class Meta:
        model = FUA
        fields = ['id',
            'renipress', 'lote', 'numero',
            'fecha_atencion',
            'tipo_auditoria', 'estado',
            'cod_prestacion',
            'asegurado',
        ]        

class FUASerializer(serializers.ModelSerializer):
    asegurado = AseguradoSerializer()
    procedimientos = ProcedimientoSerializer(many=True)
    creado_por = serializers.PrimaryKeyRelatedField(queryset=Usuario.objects.all())
    dia = serializers.IntegerField(write_only=True)
    mes = serializers.IntegerField(write_only=True)
    anio = serializers.IntegerField(write_only=True)
    
    #fua_list = FUAListSerializer(read_only=True, source='*')

    class Meta:
        model = FUA
        fields = [
            'id',
            'dia', 'mes', 'anio',
            'renipress', 'lote', 'numero',
            'tipo_fua', 'tipo_auditoria', 'estado',
            'cod_prestacion', 'nombre_prestacion',
            'asegurado', 'procedimientos',
            'creado_por', 'creado_en',
            
        ]
        read_only_fields = ['creado_en']
    
  
    def create(self, validated_data):
        # Extraer dia, mes, anio y crear fecha_atencion
        dia = validated_data.pop('dia')
        mes = validated_data.pop('mes')
        anio = validated_data.pop('anio')
        
        
        fecha_atencion = date(anio, mes, dia)
        
        validated_data['fecha_atencion'] = fecha_atencion
        
        
        # Extraer asegurado y procedimientos
        asegurado_data = validated_data.pop('asegurado')
        procedimientos_data = validated_data.pop('procedimientos')

        # Crear el FUA (sin asegurado ni procedimientos)
        fua = FUA.objects.create(**validated_data)

        # Crear asegurado (relacionado one-to-one con el fua)
        Asegurado.objects.create(fua=fua, **asegurado_data)

        # Crear procedimientos relacionados con el fua
        for proc_data in procedimientos_data:
            Procedimiento.objects.create(fua=fua, **proc_data)

        return fua

    def update(self, instance, validated_data):
        # Manejar fecha si se proporcionan dia, mes, anio
        dia = validated_data.pop('dia', None)
        mes = validated_data.pop('mes', None)
        anio = validated_data.pop('anio', None)
        
        if dia and mes and anio:
            fecha_atencion = date(anio, mes, dia)
            validated_data['fecha_atencion'] = fecha_atencion
        
        # Extraer datos de campos anidados
        asegurado_data = validated_data.pop('asegurado', None)
        procedimientos_data = validated_data.pop('procedimientos', None)
        
        # Actualizar campos del FUA principal
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Actualizar asegurado (relación one-to-one)
        if asegurado_data is not None:
            asegurado = instance.asegurado
            for attr, value in asegurado_data.items():
                setattr(asegurado, attr, value)
            asegurado.save()
        
        # Actualizar procedimientos (relación one-to-many)
        # Actualizar procedimientos
        if procedimientos_data is not None:
            procedimientos_con_id = [p for p in procedimientos_data if p.get('id')]
            procedimientos_sin_id = [p for p in procedimientos_data if not p.get('id')]

            # IDs que deben mantenerse
            ids_a_mantener = [p['id'] for p in procedimientos_con_id if 'id' in p]

            # Solo eliminamos si el frontend ha enviado menos de los existentes
            if ids_a_mantener:
                instance.procedimientos.exclude(id__in=ids_a_mantener).delete()

            # Actualizar procedimientos existentes
            for proc_data in procedimientos_con_id:
                proc_id = proc_data.pop('id')
                try:
                    procedimiento = Procedimiento.objects.get(id=proc_id, fua=instance)
                    for attr, value in proc_data.items():
                        setattr(procedimiento, attr, value)
                    procedimiento.save()
                except Procedimiento.DoesNotExist:
                    pass  # Opcional: podrías lanzar una excepción aquí

            # Crear nuevos procedimientos
            for proc_data in procedimientos_sin_id:
                Procedimiento.objects.create(fua=instance, **proc_data)

        return instance

class FuaEstadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = FUA
        fields = ['estado']