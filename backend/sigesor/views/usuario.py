from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from sigesor.serializers.usuario import CustomTokenObtainPairSerializer
from sigesor.serializers.usuario import UsuarioSerializer,UserSerializer,UsuarioUpdate
from sigesor.models import Usuario

#Vista para crear usuario
class UsuarioRegistroView(APIView):
    def post(self, request):
        serializer = UsuarioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'mensaje': 'Usuario creado correctamente', 'usuario': serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#Vista para obtener Usuarios
class UsuarioListView(APIView):
    def get(self, request):
        usuarios = Usuario.objects.all()
        serializer = UsuarioSerializer(usuarios, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
 #Vista para eliminar usuario   
class UsuarioDeleteView(APIView):
    def delete(self, request, dni):
        try:
            usuario = Usuario.objects.get(dni=dni)
            usuario.delete()
            return Response({'mensaje': 'Usuario eliminado correctamente'}, status=status.HTTP_204_NO_CONTENT)
        except Usuario.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
#Vista para detalle de Usuario muestra en la tabla los usuarios
class UsuarioDetailView(APIView):
    def get(self, request, dni):
        try:
            usuario = Usuario.objects.get(dni=dni)
            serializer = UsuarioSerializer(usuario)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Usuario.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, dni):
        try:
            usuario = Usuario.objects.get(dni=dni)
        except Usuario.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = UsuarioSerializer(usuario, data=request.data, partial=False)
        if serializer.is_valid():
            # Si se incluye password, cambiarla correctamente
            password = serializer.validated_data.get('password', None)
            if password:
                usuario.set_password(password)
            serializer.save()
            return Response({'mensaje': 'Usuario actualizado correctamente', 'usuario': serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#Vista para editar usuario
class UsuarioEditView(RetrieveUpdateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioUpdate  # Aquí usas el nuevo serializer
    lookup_field = "dni"
    
    def put(self, request, *args, **kwargs):
        print("⚠️ Método PUT recibido")
        return super().put(request, *args, **kwargs)
 
 #Vista para resetear contraseña   
class ResetPasswordView(APIView):
    def post(self, request, dni):
        try:
            usuario = Usuario.objects.get(dni=dni)
            usuario.set_password(usuario.dni)  # contraseña por defecto = DNI
            usuario.save()
            return Response({'detail': 'Contraseña restablecida correctamente.'}, status=status.HTTP_200_OK)
        except Usuario.DoesNotExist:
            return Response({'detail': 'Usuario no encontrado.'}, status=status.HTTP_404_NOT_FOUND)    

#Vista Login Autenticacion del USuario actual
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    
class UsuarioActualView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication] 

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)   
     
  #Vista para cambiar contraseña  
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication] 

    def post(self, request):
        actual_password = request.data.get("actual_password")
        nueva_password = request.data.get("nueva_password")

        if not actual_password or not nueva_password:
            return Response({"detail": "Todos los campos son obligatorios."},
                            status=status.HTTP_400_BAD_REQUEST)

        usuario = request.user

        if not usuario.check_password(actual_password):
            return Response({"detail": "Contraseña actual incorrecta."},
                            status=status.HTTP_400_BAD_REQUEST)

        usuario.set_password(nueva_password)
        usuario.save()
        return Response({"detail": "Contraseña cambiada correctamente."}, status=status.HTTP_200_OK)