"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Save, ArrowLeft } from "lucide-react"

export default function EditarUsuarioPage({ params }) {
  const router = useRouter()
  const { id } = params

  const [formData, setFormData] = useState({
    dni: "",
    paterno: "",
    materno: "",
    nombres: "",
    rol: "",
    usuario: "",
  })

  const [errors, setErrors] = useState({})

  // Simular carga de datos del usuario
  useEffect(() => {
    // En un caso real, aquí se cargarían los datos del usuario desde una API
    const usuariosSimulados = [
      {
        id: 1,
        dni: "45678912",
        paterno: "Gómez",
        materno: "Pérez",
        nombres: "Juan Carlos",
        rol: "Administrador",
        usuario: "jgomez",
      },
      {
        id: 2,
        dni: "78912345",
        paterno: "Rodríguez",
        materno: "López",
        nombres: "María Elena",
        rol: "Operador",
        usuario: "mrodriguez",
      },
      {
        id: 3,
        dni: "12345678",
        paterno: "Martínez",
        materno: "Sánchez",
        nombres: "Pedro José",
        rol: "Supervisor",
        usuario: "pmartinez",
      },
    ]

    const usuario = usuariosSimulados.find((u) => u.id === Number.parseInt(id))

    if (usuario) {
      setFormData(usuario)
    } else {
      // Si no se encuentra el usuario, redirigir a la lista
      router.push("/dashboard/configurar-usuario")
    }
  }, [id, router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Limpiar error cuando el usuario comienza a escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Validar DNI (8 dígitos)
    if (!formData.dni || formData.dni.length !== 8 || !/^\d+$/.test(formData.dni)) {
      newErrors.dni = "El DNI debe tener 8 dígitos numéricos"
    }

    // Validar campos obligatorios
    if (!formData.paterno) newErrors.paterno = "El apellido paterno es obligatorio"
    if (!formData.nombres) newErrors.nombres = "El nombre es obligatorio"
    if (!formData.usuario) newErrors.usuario = "El nombre de usuario es obligatorio"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      // Aquí iría la lógica para actualizar el usuario
      alert("Usuario actualizado correctamente")
      router.push("/dashboard/configurar-usuario")
    }
  }

  const handleCancel = () => {
    router.push("/dashboard/configurar-usuario")
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button onClick={handleCancel} className="mr-2 p-1 rounded hover:bg-gray-800">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-semibold">Editar Usuario</h1>
        </div>
        <button onClick={handleSubmit} className="btn btn-primary flex items-center gap-1">
          <Save className="h-4 w-4" />
          <span>Guardar</span>
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Datos personales */}
            <div>
              <h2 className="text-lg font-medium mb-4">Datos Personales</h2>

              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-1">DNI:</label>
                <input
                  type="text"
                  name="dni"
                  className={`w-full ${errors.dni ? "border-red-500" : ""}`}
                  value={formData.dni}
                  onChange={handleChange}
                  maxLength={8}
                />
                {errors.dni && <p className="text-red-500 text-xs mt-1">{errors.dni}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-1">Apellido Paterno:</label>
                <input
                  type="text"
                  name="paterno"
                  className={`w-full ${errors.paterno ? "border-red-500" : ""}`}
                  value={formData.paterno}
                  onChange={handleChange}
                />
                {errors.paterno && <p className="text-red-500 text-xs mt-1">{errors.paterno}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-1">Apellido Materno:</label>
                <input type="text" name="materno" className="w-full" value={formData.materno} onChange={handleChange} />
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-1">Nombres:</label>
                <input
                  type="text"
                  name="nombres"
                  className={`w-full ${errors.nombres ? "border-red-500" : ""}`}
                  value={formData.nombres}
                  onChange={handleChange}
                />
                {errors.nombres && <p className="text-red-500 text-xs mt-1">{errors.nombres}</p>}
              </div>
            </div>

            {/* Datos de acceso */}
            <div>
              <h2 className="text-lg font-medium mb-4">Datos de Acceso</h2>

              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-1">Rol:</label>
                <select name="rol" className="w-full" value={formData.rol} onChange={handleChange}>
                  <option value="Administrador">Administrador</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Operador">Operador</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-1">Usuario:</label>
                <input
                  type="text"
                  name="usuario"
                  className={`w-full ${errors.usuario ? "border-red-500" : ""}`}
                  value={formData.usuario}
                  onChange={handleChange}
                />
                {errors.usuario && <p className="text-red-500 text-xs mt-1">{errors.usuario}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-1">Cambiar Contraseña:</label>
                <button type="button" className="btn btn-secondary w-full">
                  Restablecer Contraseña
                </button>
                <p className="text-xs text-gray-400 mt-1">
                  Al restablecer la contraseña, se enviará un correo al usuario con instrucciones.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
