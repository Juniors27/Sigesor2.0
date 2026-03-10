import { useState } from "react"
import axios from "axios"
import { toast } from "sonner"

export default function ModalCambiarContrasena({ onClose }) {
  const [actual, setActual] = useState("")
  const [nueva, setNueva] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!actual || !nueva) {
      toast.warning("Todos los campos son obligatorios.")
      return
    }
    if (nueva.length < 6) {
      toast.warning("La nueva contraseña debe tener al menos 6 caracteres.")
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      await axios.post(
        "http://127.0.0.1:8000/api/usuarios/cambiar-contrasena/",
        {
          actual_password: actual,
          nueva_password: nueva,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      toast.success("Contraseña cambiada con éxito.")
      onClose()
    } catch (err) {
      console.error(err)
      if (err.response?.status === 400) {
        toast.error("La contraseña actual es incorrecta.")
      } else {
        toast.error("Error al cambiar la contraseña.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-xl font-semibold text-white mb-4">Cambiar Contraseña</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-1">Contraseña Actual</label>
            <input
              type="password"
              value={actual}
              onChange={(e) => setActual(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-1">Nueva Contraseña</label>
            <input
              type="password"
              value={nueva}
              onChange={(e) => setNueva(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-white bg-gray-600 rounded hover:bg-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-500 disabled:opacity-50"
            >
              Cambiar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
