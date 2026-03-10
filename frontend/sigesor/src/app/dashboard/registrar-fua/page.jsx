"use client"

import { useState, useEffect } from "react"
import { Save, ChevronDown, Plus, Trash2, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import  procedimientosFua  from "@/components/ProcedimientosFua"

export default function RegistrarFuaPage() {
  const [formFua, setFormFua] = useState({
    renipress: "5196",
    dia: "",
    mes: "",
    anio: "2025",
    cod_prestacion: "",
    prestacion_realizada: "",
    cod_sis_1: "180",
    cod_sis_2: "",
    lote: "",
    numero: "",
    tipo_fua: "extemporaneo",
    tipo_auditoria: "",
    estado: "observado",
    dni: "",
    historia_clinica: "",
    creado_por: "",
    procedimientos: [],
    nuevoProcedimiento: { codigo: "", nombre: "", cantidad: 1 },
  })

  const [errors, setErrors] = useState({})
  const [isCheckingFUA, setIsCheckingFUA] = useState(false)
  const token = localStorage.getItem("token");

  // Función para verificar si el FUA ya existe
  const verificarFUADuplicado = async (lote, numero) => {
    if (!lote || !numero || numero.length < 8) return

    setIsCheckingFUA(true)
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/fua/verificar-duplicado/?lote=${lote}&numero=${numero}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const data = await response.json()

      if (data.existe) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          numero: `Este FUA (${lote}-${numero}) ya está registrado en el sistema`,
        }))
        toast.error("FUA duplicado", {
          description: `El FUA ${lote}-${numero} ya existe`,
        })
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          numero: null,
        }))
      }
    } catch (error) {
      console.error("Error al verificar FUA:", error)
    } finally {
      setIsCheckingFUA(false)
    }
  }

  const handleBlur = () => {
    if (!formFua.historia_clinica) {
      setFormFua((prev) => ({ ...prev, historia_clinica: prev.dni }))
    }
  }

  // Códigos a nombres
  const prestaciones = {
    "065": "Internamiento",
    "050": "Recien Nacido",
    "051": "Internamiento del Recien Nacido",
    "054": "Parto Vaginal",
    "055": "Cesárea",
    "056": "Consulta Externa",
    "062": "Emergencia",
    "063": "Emergencia con Observacion",
    "064": "Cirugia Ambulatoria",
    "066": "Internamiento con Cirugia Menor",
    "067": "Internamiento con Cirugia Mayor",
    "070": "Apoyo al Diagnostico",
    906: "Telemedicina",
    "068": "UCI",
    "071": "Apoyo al Diagnóstico",
  }

  // Actualizar nombre de prestación
  useEffect(() => {
    const nombre = prestaciones[formFua.cod_prestacion]
    setFormFua((prev) => ({
      ...prev,
      prestacion_realizada: nombre || "",
    }))
  }, [formFua.cod_prestacion])

  //actualizar nombre de procedimientos
  // Actualizar nombre de procedimiento cuando cambia el código
  useEffect(() => {
    const codigo = formFua.nuevoProcedimiento.codigo
    const nombre = procedimientosFua[codigo]
    if (nombre && nombre !== formFua.nuevoProcedimiento.nombre) {
      setFormFua((prev) => ({
        ...prev,
        nuevoProcedimiento: {
          ...prev.nuevoProcedimiento,
          nombre: nombre,
        },
      }))
    }
  }, [formFua.nuevoProcedimiento.codigo])

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Verificar si hay error de FUA duplicado
    if (errors.numero) {
      toast.error("Corrige los errores antes de guardar")
      return
    }

    if (isCheckingFUA) {
      toast.error("Espera un momento", {
        description: "Estamos verificando el FUA...",
      })
      return
    }

    const { dia, mes, anio } = formFua;
    const diaNum = parseInt(dia);
    const mesNum = parseInt(mes);
    const anioNum = parseInt(anio);

    const hoy = new Date();
    const anioActual = hoy.getFullYear();

    // Validaciones básicas de mes y año
    if (anioNum < 2019 || anioNum > anioActual) {
      toast.error("El año debe estar entre 2019 y el actual.");
      return;
    }

    if (mesNum < 1 || mesNum > 12) {
      toast.error("El mes debe estar entre 1 y 12.");
      return;
    }

    // Obtener el último día del mes para validar día (considera bisiestos)
    const ultimoDia = new Date(anioNum, mesNum, 0).getDate();

    if (diaNum < 1 || diaNum > ultimoDia) {
      toast.error(`El día debe estar entre 1 y ${ultimoDia} para el mes seleccionado.`);
      return;
    }
    //validar fecha futura
    const fecha_futura = new Date(`${anioNum}-${String(mesNum).padStart(2, "0")}-${String(diaNum).padStart(2, "0")}`);
    if (fecha_futura > hoy) {
      toast.error("La fecha de atención no puede ser futura.");
      return;
    }

    const fecha_atencion = `${formFua.anio}-${String(formFua.mes).padStart(2, "0")}-${String(formFua.dia).padStart(2, "0")}`


    console.log("Tokeeeen:", token)
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    const userId = tokenPayload.user_id;

    const fuaData = {
      renipress: formFua.renipress,
      dia: formFua.dia,
      mes: formFua.mes,
      anio: formFua.anio,
      fecha_atencion,
      cod_prestacion: formFua.cod_prestacion,
      nombre_prestacion: formFua.prestacion_realizada,
      cod_sis_1: formFua.cod_sis_1,
      cod_sis_2: formFua.cod_sis_2,
      lote: formFua.lote,
      numero: formFua.numero,
      tipo_fua: formFua.tipo_fua,
      tipo_auditoria: formFua.tipo_auditoria,
      estado: formFua.estado,
      creado_por: userId,
      asegurado: {
        dni: formFua.dni,
        historia_clinica: formFua.historia_clinica,
        cod_afiliacion: formFua.cod_sis_2,
      },
      procedimientos: formFua.procedimientos.map((proc) => ({
        cod_prestacion: proc.codigo,
        nombre_prestacion: proc.nombre,
        cantidad: proc.cantidad,
      })),
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/fua/registro/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(fuaData),
      })


      if (!response.ok) {
        const errorData = await response.json()
        console.error("Error en la respuesta:", errorData);


        toast.error("Error en el envío")
        return
      }

      const data = await response.json()
      toast.success("FUA registrado exitosamente")

      // Limpiar formulario si deseas
      setFormFua({
        renipress: "5196",
        dia: "",
        mes: "",
        anio: "2025",
        cod_prestacion: "",
        prestacion_realizada: "",
        cod_sis_1: "180",
        cod_sis_2: "",
        lote: "",
        numero: "",
        tipo_fua: "extemporaneo",
        tipo_auditoria: "",
        estado: "observado",
        dni: "",
        historia_clinica: "",
        procedimientos: [],
        nuevoProcedimiento: { codigo: "", nombre: "", cantidad: 1 },
      })
      setErrors({})
    } catch (error) {
      toast.error("Error en la solicitud")
    }
  }

  // Agregar procedimiento
  const handleAddProcedimiento = (e) => {
    e.preventDefault()
    const { nuevoProcedimiento } = formFua
    if (nuevoProcedimiento.codigo && nuevoProcedimiento.nombre) {
      if (!procedimientosFua[nuevoProcedimiento.codigo]) {
        toast.warning("Código de procedimiento no encontrado en el catálogo")
      }

      setFormFua((prev) => ({
        ...prev,
        procedimientos: [...prev.procedimientos, { id: Date.now(), ...nuevoProcedimiento }],
        nuevoProcedimiento: { codigo: "", nombre: "", cantidad: 1 },
      }))
    } else {
      toast.error("Por favor complete el código y nombre del procedimiento")
    }
  }

  // Eliminar procedimiento
  const handleRemoveProcedimiento = (id) => {
    setFormFua((prev) => ({
      ...prev,
      procedimientos: prev.procedimientos.filter((proc) => proc.id !== id),
    }))
  }

  // Función helper para actualizar campos del formulario
  const updateFormField = (field, value) => {
    setFormFua((prev) => ({
      ...prev,
      [field]: value
    }))

    // Limpiar error si existe
    if (errors[field]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: null,
      }))
    }
  }

  const formatNumberOnBlur = () => {
    const numeroFormateado = formFua.numero.replace(/\D/g, '').padStart(8, '0')
    setFormFua(prevState => ({
      ...prevState,
      numero: numeroFormateado
    }));

    // Verificar duplicado cuando se complete el número
    if (formFua.lote && numeroFormateado.length === 8) {
      verificarFUADuplicado(formFua.lote, numeroFormateado)
    }
  };

  // También verificar cuando cambia el lote si ya hay número
  const handleLoteChange = (value) => {
    updateFormField("lote", value)
    if (value && formFua.numero.length === 8) {
      verificarFUADuplicado(value, formFua.numero)
    }
  }

  // Función helper para actualizar nuevoProcedimiento
  const updateNuevoProcedimiento = (field, value) => {
    setFormFua((prev) => ({
      ...prev,
      nuevoProcedimiento: {
        ...prev.nuevoProcedimiento,
        [field]: value,
      },
    }))
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Registrar FUA</h1>
        <button onClick={handleSubmit} className="btn btn-primary flex items-center gap-1">
          <Save className="h-4 w-4" />
          <span>Guardar</span>
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Datos de la Entidad - Ahora primero */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-lg font-medium mb-4">Datos de la Entidad</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">RENIPRESS:</label>
                <input type="text" className="w-full" value="00005196" readOnly />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Establecimiento:</label>
                <input type="text" className="w-full" value="H.R.D.T." readOnly />
              </div>
            </div>
          </div>

          {/* Fecha de Atención - Ahora segundo y con tamaño ajustado */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-lg font-medium mb-4">Fecha de Atención</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Día:</label>
                <input
                  type="text"
                  className="w-full"
                  maxLength="2"
                  placeholder="DD"
                  value={formFua.dia}
                  onChange={(e) => updateFormField("dia", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Mes:</label>
                <input
                  type="text"
                  className="w-full"
                  maxLength="2"
                  placeholder="MM"
                  value={formFua.mes}
                  onChange={(e) => updateFormField("mes", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Año:</label>
                <input
                  type="text"
                  className="w-full"
                  maxLength="4"
                  placeholder="AAAA"
                  value={formFua.anio}
                  onChange={(e) => updateFormField("anio", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Tipo de FUA */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-lg font-medium mb-4">Tipo de FUA</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Seleccione el tipo:</label>
                <div className="relative">
                  <select
                    className="w-full pr-8 appearance-none"
                    value={formFua.tipo_fua}
                    onChange={(e) => updateFormField("tipo_fua", e.target.value)}
                  >
                    <option value="extemporaneo">Extemporáneo</option>
                    <option value="observado">Observado</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Tipo de Auditoría:</label>
                <div className="relative">
                  <select
                    className="w-full pr-8 appearance-none"
                    value={formFua.tipo_auditoria}
                    onChange={(e) => updateFormField("tipo_auditoria", e.target.value)}
                  >
                    <option value="">Seleccionar</option>
                    <option value="reconsideracion">Reconsideración</option>
                    <option value="pcpp">PCPP</option>
                    <option value="fissal">FISSAL</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Estado:</label>
                <div className="relative">
                  <select
                    className="w-full pr-8 appearance-none"
                    value={formFua.estado}
                    onChange={(e) => updateFormField("estado", e.target.value)}
                  >
                    <option value="observado">Observado</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="enviado">Enviado</option>
                    <option value="rechazado">Rechazado</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formato y Numeración de FUA + Datos de la prestacion  */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-lg font-medium mb-4">Datos del FUA</h2>
            <div className="grid grid-cols-1 gap-4">
              {/* Formato y Numeración de FUA */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">RENIPRESS:</label>
                  <input type="text" className="w-full" value="00005196" readOnly />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Lote:</label>
                  <input
                    type="text"
                    className="w-full"
                    maxLength="2"
                    placeholder="25"
                    value={formFua.lote}
                    onChange={(e) => handleLoteChange(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Número:</label>
                  <div className="relative">
                    <input
                      type="text"
                      className={`w-full ${errors.numero ? "border-red-500" : ""}`}
                      maxLength="8"
                      placeholder="00001526"
                      value={formFua.numero}
                      onChange={(e) => updateFormField("numero", e.target.value)}
                      onBlur={formatNumberOnBlur}
                    />
                    {isCheckingFUA && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      </div>
                    )}
                  </div>
                  {errors.numero && (
                    <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                      <AlertCircle className="h-3 w-3" />
                      <p>{errors.numero}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Línea divisoria */}
              <div className="border-t border-gray-700 my-2"></div>

              {/* Datos de la prestacion */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Cod. Prestación:</label>
                  <input
                    type="text"
                    className="w-full"
                    value={formFua.cod_prestacion}
                    onChange={(e) => updateFormField("cod_prestacion", e.target.value)}
                    placeholder="Ej: 065"
                    maxLength="3"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Prestación Realizada:</label>
                  <input
                    type="text"
                    className="w-full"
                    value={formFua.prestacion_realizada}
                    readOnly
                    placeholder={formFua.prestacion_realizada ? "" : "Ingrese un código válido"}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Datos de la Atención */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-lg font-medium mb-4">Datos del Asegurado</h2>
            <div className="grid grid-cols-3 gap-4 mt-2">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Cod. SIS:</label>
                <div className="flex gap-2">
                  <input type="text" className="w-full" value="180" readOnly />
                  <input
                    type="text"
                    className="w-full"
                    value={formFua.cod_sis_2}
                    onChange={(e) => updateFormField("cod_sis_2", e.target.value)}
                    placeholder="Código SIS 2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">DNI:</label>
                <input
                  type="text"
                  className="w-full"
                  maxLength="8"
                  placeholder="12345678"
                  value={formFua.dni}
                  onChange={(e) => updateFormField("dni", e.target.value)}
                  onBlur={handleBlur}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">N° Hist. Clín:</label>
                <input
                  type="text"
                  className="w-full"
                  maxLength="8"
                  placeholder="123456"
                  value={formFua.historia_clinica}
                  onChange={(e) => updateFormField("historia_clinica", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Procedimientos */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-medium mb-4">Procedimientos</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Código:</label>
              <input
                type="text"
                className="w-full"
                value={formFua.nuevoProcedimiento?.codigo || ""}
                onChange={(e) => updateNuevoProcedimiento("codigo", e.target.value)}
                placeholder="Ej: 99203"
                maxLength="10"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Nombre:</label>
              <input
                type="text"
                className="w-full"
                value={formFua.nuevoProcedimiento?.nombre || ""}
                onChange={(e) => updateNuevoProcedimiento("nombre", e.target.value)}
                placeholder={procedimientosFua[formFua.nuevoProcedimiento?.codigo] || "Ej: Consulta médica"}
                readOnly={!!procedimientosFua[formFua.nuevoProcedimiento?.codigo]}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Cantidad:</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  className="w-full"
                  value={formFua.nuevoProcedimiento?.cantidad || 1}
                  min="1"
                  onChange={(e) => updateNuevoProcedimiento("cantidad", Number.parseInt(e.target.value) || 1)}
                />
                <button
                  type="button"
                  onClick={handleAddProcedimiento}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 rounded flex items-center"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-900">
                  <th className="text-left p-2">Código</th>
                  <th className="text-left p-2">Nombre</th>
                  <th className="text-right p-2">Cantidad</th>
                  <th className="w-10 p-2"></th>
                </tr>
              </thead>
              <tbody>
                {formFua.procedimientos.length > 0 ? (
                  formFua.procedimientos.map((proc) =>
                    proc ? (
                      <tr key={proc.id} className="hover:bg-gray-700">
                        <td className="p-2">{proc.codigo}</td>
                        <td className="p-2">{proc.nombre}</td>
                        <td className="text-right p-2">{proc.cantidad}</td>
                        <td className="p-2">
                          <button
                            type="button"
                            onClick={() => handleRemoveProcedimiento(proc.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ) : null,
                  )
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-400">
                      Sin datos
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </form>
    </div>
  )
}