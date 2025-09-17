from django.db import models
from .fua import FUA

# ---------------------
# 5. Asegurado (Datos fijos + DNI, historia, afiliación)
# ---------------------
class Asegurado(models.Model):
    fua = models.OneToOneField(FUA, on_delete=models.CASCADE, related_name='asegurado')
    codigo_fijo = models.CharField(max_length=10, default='180')
    cod_afiliacion = models.CharField(max_length=20)
    dni = models.CharField(max_length=8)
    historia_clinica = models.CharField(max_length=20)

    def __str__(self):
        return f'{self.dni} - {self.cod_afiliacion}'
