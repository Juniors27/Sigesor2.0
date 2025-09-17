from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from sigesor.models import Usuario

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['dni', 'apellido_paterno', 'apellido_materno', 'nombres', 'rol', 'password']
        extra_kwargs = {'password': {'write_only': True, 'required': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        usuario = Usuario(**validated_data)
        usuario.set_password(password)
        usuario.save()
        return usuario
    
    def update(self, instance, validated_data):
        if 'password' in validated_data:
            instance.set_password(validated_data.pop('password'))    
        for attr, value in validated_data.items():
            setattr(instance, attr, value)    
            instance.save()
        return instance

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['dni', 'nombres', 'apellido_paterno', 'apellido_materno', 'rol']



class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = Usuario.USERNAME_FIELD  # usa 'dni' como username

    def validate(self, attrs):
        data = super().validate(attrs)

        user = self.user
        data.update({
            'rol': user.rol,
            'nombres': user.nombres,
            'apellido_paterno': user.apellido_paterno,
            'apellido_materno': user.apellido_materno,
            'dni': user.dni,
        })

        return data

#Vista Editar Usuario    
class UsuarioUpdate(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        exclude = ['password']    