from django.db import models
from .fua import FUA

# ---------------------
# 6. Procedimientos asociados al FUA
# ---------------------
class Procedimiento(models.Model):
    fua = models.ForeignKey(FUA, on_delete=models.CASCADE, related_name='procedimientos')
    cod_prestacion = models.CharField(max_length=20)
    nombre_prestacion = models.CharField(max_length=200)
    cantidad = models.PositiveIntegerField()

    def __str__(self):
        return f'{self.cod_prestacion} - {self.nombre_prestacion} ({self.cantidad})'