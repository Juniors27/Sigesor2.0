from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

# ---------------------
# 1. Gestor personalizado de usuarios
# ---------------------
class UsuarioManager(BaseUserManager):
    def create_user(self, dni, apellido_paterno, apellido_materno, nombres, rol, password=None):
        if not dni:
            raise ValueError("El usuario debe tener un DNI.")
        user = self.model(
            dni=dni,
            apellido_paterno=apellido_paterno,
            apellido_materno=apellido_materno,
            nombres=nombres,
            rol=rol
        )
        user.set_password(password or dni)
        user.save(using=self._db)
        return user

    def create_superuser(self, dni, apellido_paterno, apellido_materno, nombres, rol='responsable_pdd', password=None):
        user = self.create_user(dni, apellido_paterno, apellido_materno, nombres, rol, password)
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user


# ---------------------
# 2. Usuario personalizado
# ---------------------
class Usuario(AbstractBaseUser, PermissionsMixin):
    ROLES = (
        ('responsable_pdd', 'Responsable PDD'),
        ('encargado_pdd', 'Encargado PDD'),
        ('digitador', 'Digitador'),
        ('auditor', 'Auditor'),
    )

    dni = models.CharField(max_length=8, unique=True)
    apellido_paterno = models.CharField(max_length=50)
    apellido_materno = models.CharField(max_length=50)
    nombres = models.CharField(max_length=100)
    rol = models.CharField(max_length=20, choices=ROLES)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UsuarioManager()

    USERNAME_FIELD = 'dni'
    REQUIRED_FIELDS = ['apellido_paterno', 'apellido_materno', 'nombres', 'rol']

    def __str__(self):
        return f'{self.nombres} ({self.get_rol_display()})'
