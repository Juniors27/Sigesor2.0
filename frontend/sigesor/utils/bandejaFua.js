import * as XLSX from "xlsx"

export function formatFuaNumber(fua) {
  return `${fua.renipress}-${fua.lote}-${fua.numero}`
}

export function formatFuaDate(dateString) {
  const [year, month, day] = dateString.split("-")
  return `${day}/${month}/${year}`
}

export function mapAuditoriaLabel(tipo) {
  const labels = {
    reconsideracion: "Reconsideracion",
    pcpp: "PCPP",
    fissal: "FISSAL",
  }

  return labels[tipo] || `${tipo.charAt(0).toUpperCase()}${tipo.slice(1)}`
}

export function mapEstadoLabel(estado) {
  const labels = {
    observado: "Observado",
    pendiente: "Pendiente",
    enviado: "Enviado",
    rechazado: "Rechazado",
  }

  return labels[estado] || `${estado.charAt(0).toUpperCase()}${estado.slice(1)}`
}

export function exportFuasToExcel(fuas, fileName) {
  const dataToExport = fuas.map((fua) => ({
    "N\u00b0 FUA": formatFuaNumber(fua),
    Fecha: formatFuaDate(fua.fecha_atencion),
    Afiliacion: fua.asegurado.cod_afiliacion,
    DNI: fua.asegurado.dni,
    HC: fua.asegurado.historia_clinica,
    "Cod. Prestacion": fua.cod_prestacion,
    Auditoria: mapAuditoriaLabel(fua.tipo_auditoria),
    Estado: mapEstadoLabel(fua.estado),
  }))

  const worksheet = XLSX.utils.json_to_sheet(dataToExport)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Fuas")
  XLSX.writeFile(workbook, fileName)
}
