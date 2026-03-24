import BandejaFuaPageScreen from "@/components/features/bandeja-fua/BandejaFuaPageScreen"

export default function BandejaObservadosPageScreen() {
  return (
    <BandejaFuaPageScreen
      trayType="observados"
      title="Bandeja Observados"
      description="Consulta registros observados con filtros por periodo, fecha o n\u00famero de FUA."
      headerAccentClass="bg-amber-500/10"
      headerIconColorClass="text-amber-300"
      exportFileName="FuasObservados.xlsx"
    />
  )
}

