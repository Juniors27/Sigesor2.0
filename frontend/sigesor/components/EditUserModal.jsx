import { useEffect, useState, Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { ArrowLeft, Save } from "lucide-react"
import { toast } from "sonner"

export default function EditUserModal({ open, onClose, usuario, onUpdated }) {
    const [formData, setFormData] = useState({
        dni: "",
        apellido_paterno: "",
        apellido_materno: "",
        nombres: "",
        rol: "",
        //password: "",
    })

    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (usuario) {
            setFormData({
                ...usuario,
                //password: "", // Opcional: limpiar password por seguridad
            })
        }
    }, [usuario])

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSave = async () => {
        setErrors({})
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/usuarios/${formData.dni}/editar/`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (!res.ok) {
                //console.error("Código de error:", res.status)
                //console.error("Respuesta del backend:", data)
                const errorData = await res.json()
                if (errorData && typeof errorData === "object") {
                    setErrors(errorData)
                }
                throw new Error("Error al actualizar el usuario")
            }

            const updatedUser = await res.json()
            toast.success("Usuario actualizado correctamente.")
            onUpdated(updatedUser)
            onClose()
        } catch (error) {
            console.error(error)
            toast.error("Error al actualizar el usuario.")
        }
    }

    return (
        <Transition appear show={open} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-xl bg-gray-900 p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center">
                                        <button onClick={onClose} className="mr-2 p-1 rounded hover:bg-gray-800">
                                            <ArrowLeft className="h-5 w-5" />
                                        </button>
                                        <h1 className="text-xl font-semibold">Editar Usuario</h1>
                                    </div>
                                    <button onClick={handleSave} className="btn btn-primary flex items-center gap-1">
                                        <Save className="h-4 w-4" />
                                        <span>Guardar</span>
                                    </button>
                                </div>

                                <form onSubmit={(e) => e.preventDefault()}>
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
                                                    disabled
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
                                                <input
                                                    type="text"
                                                    name="apellido_materno"
                                                    className="w-full"
                                                    value={formData.apellido_materno}
                                                    onChange={handleChange}
                                                />
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
                                                    <option value="responsable_pdd">Responsable PDD</option>
                                                    <option value="encargado_pdd">Encargado PDD</option>
                                                    <option value="digitador">Digitador</option>
                                                    <option value="auditor">Auditor</option>
                                                </select>
                                            </div>                                            
                                        </div>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
