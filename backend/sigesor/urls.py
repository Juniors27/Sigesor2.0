from django.contrib import admin
from django.urls import path
from . import views
from sigesor.views.usuario import UsuarioRegistroView, UsuarioListView, UsuarioDeleteView, UsuarioDetailView, UsuarioEditView, ResetPasswordView
from sigesor.views.usuario import CustomTokenObtainPairView,UsuarioActualView,ChangePasswordView
from sigesor.views.fua import FUARegistroView, FUAsExtemporaneosView,FechasDisponiblesExtemporaneosView,FUAByIdView, FuaEstadoUpdateView, FUAsObservadosView,FechasDisponiblesObservadosView
from sigesor.views.procedimientos import ProcedimientosPorFUAView
from sigesor.views.dashboard import dashboard_stats

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/usuario/login/', CustomTokenObtainPairView.as_view(), name='login'),  
    path('api/usuario/actual/', UsuarioActualView.as_view(), name='usuario-actual'),
    path('api/usuarios/crear/', UsuarioRegistroView.as_view(), name='crear_usuario'),
    path('api/usuarios/', UsuarioListView.as_view(), name='listar_usuarios'),
    path('api/usuarios/<str:dni>/eliminar/', UsuarioDeleteView.as_view(), name='eliminar_usuario'),
    path('api/usuarios/<str:dni>/detalle/', UsuarioDetailView.as_view(), name='detalle_usuario'),
    path('api/usuarios/<str:dni>/editar/', UsuarioEditView.as_view(), name='editar_usuario'),
    path('api/usuarios/<str:dni>/reset-password/', ResetPasswordView.as_view(), name='reset_password'),
    path('api/usuarios/cambiar-contrasena/', ChangePasswordView.as_view(), name="cambiar_contrasena"),
    path('api/fua/registro/', FUARegistroView.as_view(), name='fua-registro'),
    
    #BADENJA EXTEMPORANEOS
    path('api/bandeja/extemporaneos/', FUAsExtemporaneosView.as_view(), name='bandeja-extemporaneos'),
    path("api/bandeja/extemporaneos/fechas-disponibles/", FechasDisponiblesExtemporaneosView.as_view(),name='fechas-disponibles'),
    path('api/bandeja/extemporaneos/<int:id>/', FUAByIdView.as_view(), name='eliminar-fua'),
    path('api/bandeja/extemporaneos/editar_fua/<int:id>/', FuaEstadoUpdateView.as_view(), name='editar-fua'),
    path('api/fua/procedimientos/', ProcedimientosPorFUAView.as_view(), name='procedimientos'),
    
    #BANDEJA OBSERVADOS
    path('api/bandeja/observados/', FUAsObservadosView.as_view(), name='bandeja-extemporaneos'),
    path("api/bandeja/observados/fechas-disponibles/", FechasDisponiblesObservadosView.as_view(),name='fechas-disponibles'),
    path('api/bandeja/observados/<int:id>/', FUAByIdView.as_view(), name='eliminar-fua'),
    path('api/bandeja/observados/estado/<int:id>/', FuaEstadoUpdateView.as_view(), name='editar-estado'),
    
    #DASHBOARD
    path('api/dashboard/stats/', dashboard_stats, name='dashboard_stats'),
        
]

