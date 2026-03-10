"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Save, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

export default function NuevoUsuarioPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    dni: "",
    apellido_paterno: "",
    apellido_materno: "",
    nombres: "",
    rol: "responsable_pdd", // Valor por defecto
    password: "",
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target

    // Si se escribe el DNI, también actualiza la contraseña automáticamente
    if (name === "dni") {
      setFormData((prevData) => ({
        ...prevData,
        dni: value,
        password: value  
      }))
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }))
    }

    // Limpiar errores al escribir
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: null,
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Validar DNI (8 dígitos)
    if (!formData.dni || formData.dni.length !== 8 || !/^\d+$/.test(formData.dni)) {
      newErrors.dni = "El DNI debe tener 8 dígitos numéricos"
    }

    // Validar campos obligatorios
    if (!formData.apellido_paterno) newErrors.apellido_paterno = "El apellido paterno es obligatorio"
    if (!formData.nombres) newErrors.nombres = "El nombre es obligatorio"
    if (!formData.rol) newErrors.rol = "El rol es obligatorio"
    if (!formData.password) newErrors.password = "La contraseña es obligatoria"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault();    

    if(!validateForm()){      
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/usuarios/crear/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      let data;
      try {
        // Intentar leer el cuerpo como JSON
        data = await response.json();
      } catch (jsonError) {
        // Si no es JSON, leerlo como texto
        const text = await response.text();
        console.error("Respuesta de error (texto):", text);
        toast.error("Error: respuesta no válida del servidor.");
        return;
      }

      if (!response.ok) {
        console.error("Error del servidor:", data);
        // Mostrar mensaje al usuario solo si hay detalle claro, sino mensaje genérico
        const userMessage = data.detail
          ? data.detail
          : "Error en la petición. DNI duplicado.";
        toast.error(userMessage);
        return;
      }

      // Si todo salió bien
      toast.success("Registro exitoso", {
        description: "El usuario fue registrado correctamente"
      });

      setFormData({
        dni: "",
        password: "",
        apellido_paterno: "",
        apellido_materno: "",
        nombres: "",
        rol: "responsable_pdd",
      });

    } catch (error) {
      console.error("Error inesperado:", error);
      toast.error("Error de red o del servidor. Intenta nuevamente.");
    }
  };

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
          <h1 className="text-xl font-semibold">Nuevo Usuario</h1>
        </div>
        <button 
          onClick={handleSubmit} 
          className="btn btn-primary flex items-center gap-1"
          type="button"
        >
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
                  name="apellido_paterno"
                  className={`w-full ${errors.apellido_paterno ? "border-red-500" : ""}`}
                  value={formData.apellido_paterno}
                  onChange={handleChange}
                />
                {errors.apellido_paterno && <p className="text-red-500 text-xs mt-1">{errors.apellido_paterno}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-1">Apellido Materno:</label>
                <input type="text" name="apellido_materno" className="w-full" value={formData.apellido_materno} onChange={handleChange} />
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
                <select 
                  name="rol" 
                  className={`w-full ${errors.rol ? "border-red-500" : ""}`}
                  value={formData.rol} 
                  onChange={handleChange}
                >
                  <option value="responsable_pdd">Responsable PDD</option>
                  <option value="encargado_pdd">Encargado PDD</option>
                  <option value="digitador">Digitador</option>
                  <option value="auditor">Auditor</option>
                </select>
                {errors.rol && <p className="text-red-500 text-xs mt-1">{errors.rol}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-1">Contraseña:</label>
                <input
                  type="password"
                  name="password"
                  className={`w-full ${errors.password ? "border-red-500" : ""}`}
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}