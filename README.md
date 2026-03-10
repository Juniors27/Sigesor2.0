# SIGESOR

---
**Proyecto desarrollado como Trabajo de Suficiencia Profesional**
**para la obtención del título de Ingeniero Informático.**

---

**Sistema de Gestión de FUAs Observados y Extemporáneos**

SIGESOR es una aplicación web desarrollada para gestionar **FUAs observados y extemporáneos**, permitiendo el registro, seguimiento y control de la información relacionada con los procesos administrativos dentro del área PDD.

El sistema permite a diferentes tipos de usuarios **registrar, revisar y auditar FUAs**, facilitando la organización y control de la información mediante una interfaz web moderna.

---

# Tecnologías utilizadas

## Frontend

* React
* Next.js
* TailwindCSS
* Axios y Fetch API

## Backend

* Python
* Django
* Django REST Framework

## Base de datos

* MySQL

## Otros

* Entorno virtual (`venv`)
* Docker (planeado para futuras versiones)

---

# Arquitectura del sistema

El proyecto sigue una arquitectura **Frontend – Backend desacoplada**:

```
Frontend (Next.js / React)
        ↓
   API REST
        ↓
Backend (Django + DRF)
        ↓
      MySQL
```

El frontend consume los endpoints del backend mediante **Fetch API**, permitiendo una comunicación eficiente entre ambas capas.

---

# Roles de usuario

El sistema cuenta con diferentes tipos de usuarios con permisos específicos:

### Responsable PDD

* Crea y gestiona usuarios del sistema
* Administra configuraciones generales
* Supervisa el flujo de registro de FUAs

### Auditor

* Revisa los registros de FUAs
* Realiza validaciones y observaciones

### Digitador

* Registra FUAs en el sistema
* Ingresa información relacionada a procedimientos

### Encargado PDD

* Gestiona y supervisa los procesos del área PDD

---

# Funcionalidades principales

* Autenticación de usuarios (Login)
* Dashboard administrativo
* Registro de FUAs observados y extemporáneos
* Gestión de usuarios
* Registro de procedimientos
* Consulta y visualización de registros
* Control de información por roles
* Interfaz moderna y responsive

---

# Estructura del proyecto

```
SIGESOR
│
├ backend
│   ├ sigesor
│   ├ manage.py
│   └ requirements.txt
│
└ frontend
    └ sigesor
        ├ src
        ├ components
        └ package.json
```

---

# Instalación del proyecto

## 1. Clonar repositorio

```
git clone https://github.com/Juniors27/Sigesor2.0.git
cd Sigesor2.0
```

---

# Configuración del Backend

Entrar al backend:

```
cd backend
```

Crear entorno virtual:

```
python -m venv venv
```

Activar entorno virtual:

Windows:

```
venv\Scripts\activate
```

Instalar dependencias:

```
pip install -r requirements.txt
```

Ejecutar servidor:

```
python manage.py runserver
```

---

# Configuración del Frontend

Entrar al frontend:

```
cd frontend/sigesor
```

Instalar dependencias:

```
npm install
```

Ejecutar proyecto:

```
npm run dev
```

El frontend se ejecutará normalmente en:

```
http://localhost:3000
```

---

# Capturas del sistema

Aquí puedes agregar imágenes del sistema:

* Login
* Dashboard
* Registro de FUA
* Gestión de usuarios

---

# Futuras mejoras

* Implementación de **Docker** para facilitar el despliegue y la portabilidad del sistema.
* Refactorización del frontend hacia una **arquitectura modular**, separando responsabilidades entre:

  * **Hooks** (lógica reutilizable de React)
  * **Services** (consumo de API)
  * **API configuration** (configuración centralizada de endpoints)
  * **Utils** (funciones auxiliares reutilizables)
  * **Components** (presentación UI)

Esta mejora permitirá una mejor **organización del código, mantenibilidad y escalabilidad del sistema**.


---

# Contexto académico

Este sistema fue desarrollado como parte de mi **Trabajo de Suficiencia Profesional para la obtención del título de Ingeniero Informático**.

El proyecto consiste en el desarrollo de un **Sistema de Gestión de FUAs Observados y Extemporáneos (SIGESOR)**, cuyo objetivo es optimizar el registro, control y seguimiento de los FUAs dentro del área PDD, permitiendo mejorar la organización de la información y facilitar los procesos de auditoría y supervisión.

El sistema fue desarrollado aplicando tecnologías modernas de desarrollo web, utilizando una arquitectura **Frontend – Backend desacoplada**, con **Next.js / React** en el frontend y **Django + Django REST Framework** en el backend.


# Autor

**Clemente Juniors Garcia Valle**

Proyecto desarrollado como sistema de gestión para el control de **FUAs observados y extemporáneos (SIGESOR)**.
