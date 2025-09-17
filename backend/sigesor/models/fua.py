from django.db import models
from .usuario import Usuario

# ---------------------
# 4. FUA
# ---------------------
class FUA(models.Model):
    TIPO_FUA_CHOICES = (
        ('observado', 'Observado'),
        ('extemporaneo', 'Extemporáneo'),
    )

    TIPO_AUDITORIA_CHOICES = (
        ('reconsideracion', 'Reconsideración'),
        ('pcpp', 'PCPP'),
        ('fissal', 'FISSAL'),
    )

    ESTADO_CHOICES = (
        ('observado', 'Observado'),
        ('pendiente', 'Pendiente'),
        ('enviado', 'Enviado'),
        ('rechazado', 'Rechazado'),
    )

    fecha_atencion = models.DateField()
    renipress = models.CharField(max_length=10, default='5196')  # opcional si no usas CentroSalud FK
    lote = models.CharField(max_length=10)
    numero = models.CharField(max_length=8)
    tipo_fua = models.CharField(max_length=20, choices=TIPO_FUA_CHOICES)
    tipo_auditoria = models.CharField(max_length=20, choices=TIPO_AUDITORIA_CHOICES)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES)
    cod_prestacion = models.CharField(max_length=20)
    nombre_prestacion = models.CharField(max_length=200)
    creado_por = models.ForeignKey(Usuario, on_delete=models.PROTECT, related_name='fuas')
    creado_en = models.DateTimeField(auto_now_add=True)

    def numero_completo(self):
        return f'{self.renipress}-{self.lote}-{self.numero.zfill(8)}'

    def __str__(self):
        return self.numero_completo()