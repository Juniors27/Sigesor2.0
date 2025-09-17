from django.db import models

# ---------------------
# 3. Centro de salud (por ahora solo 1)
# ---------------------
class CentroSalud(models.Model):
    renipress = models.CharField(max_length=10, default='5196', unique=True)
    nombre = models.CharField(max_length=100, default='Hospital Regional Docente de Trujillo')

    def __str__(self):
        return f'{self.nombre} ({self.renipress})'