// frontend/components/CrearUsuario.js

import { useState } from "react";

export default function CrearUsuario() {
  const [formData, setFormData] = useState({
    dni: "",
    apellido_paterno: "",
    apellido_materno: "",
    nombres: "",
    rol: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://127.0.0.1:8000/api/usuarios/crear/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Si usas JWT o alguna autenticación, debes pasar el token:
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Usuario registrado correctamente");
    } else {
      alert("Error al registrar usuario");
      console.error(data); // muestra errores de validación
    }

    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="dni" placeholder="DNI" onChange={handleChange} />
      <input
        name="apellido_paterno"
        placeholder="Apellido Paterno"
        onChange={handleChange}
      />
      <input
        name="apellido_materno"
        placeholder="Apellido Materno"
        onChange={handleChange}
      />
      <input name="nombres" placeholder="Nombres" onChange={handleChange} />
      <select name="rol" onChange={handleChange}>
        <option value="">Selecciona un rol</option>
        <option value="responsable_pdd">Responsable PDD</option>
        <option value="encargado_pdd">Encargado PDD</option>
        <option value="digitador">Digitador</option>
        <option value="auditor">Auditor</option>
      </select>
      <input
        type="password"
        name="password"
        placeholder="Contraseña"
        onChange={handleChange}
      />
      <button type="submit">Registrar Usuario</button>
    </form>
  );
}
