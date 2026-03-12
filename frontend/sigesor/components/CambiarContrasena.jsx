import useChangePasswordModal from "@/hooks/useChangePasswordModal"

export default function ModalCambiarContrasena({ onClose }) {
  const { actual, setActual, nueva, setNueva, loading, handleSubmit } = useChangePasswordModal({ onClose })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-sm rounded-lg bg-gray-900 p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold text-white">Cambiar Contrasena</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-1 block text-sm text-gray-300">Contrasena Actual</label>
            <input
              type="password"
              value={actual}
              onChange={(event) => setActual(event.target.value)}
              className="w-full rounded border border-gray-700 bg-gray-800 p-2 text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm text-gray-300">Nueva Contrasena</label>
            <input
              type="password"
              value={nueva}
              onChange={(event) => setNueva(event.target.value)}
              className="w-full rounded border border-gray-700 bg-gray-800 p-2 text-white"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-gray-600 px-4 py-2 text-sm text-white hover:bg-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-500 disabled:opacity-50"
            >
              Cambiar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
