import useCrearUsuarioForm from "@/hooks/useCrearUsuarioForm"

export default function CrearUsuario() {
  const { formData, handleChange, handleSubmit } = useCrearUsuarioForm()

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="dni" placeholder="DNI" value={formData.dni} onChange={handleChange} />
      <input
        name="apellido_paterno"
        placeholder="Apellido Paterno"
        value={formData.apellido_paterno}
        onChange={handleChange}
      />
      <input
        name="apellido_materno"
        placeholder="Apellido Materno"
        value={formData.apellido_materno}
        onChange={handleChange}
      />
      <input name="nombres" placeholder="Nombres" value={formData.nombres} onChange={handleChange} />
      <select name="rol" value={formData.rol} onChange={handleChange}>
        <option value="">Selecciona un rol</option>
        <option value="responsable_pdd">Responsable PDD</option>
        <option value="encargado_pdd">Encargado PDD</option>
        <option value="digitador">Digitador</option>
        <option value="auditor">Auditor</option>
      </select>
      <input
        type="password"
        name="password"
        placeholder="Contrasena"
        value={formData.password}
        onChange={handleChange}
      />
      <button type="submit">Registrar Usuario</button>
    </form>
  )
}
