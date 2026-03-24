import BandejaFuaPageScreen from "@/components/features/bandeja-fua/BandejaFuaPageScreen"

export default function BandejaExtemporaneosPageScreen() {
  return (
    <BandejaFuaPageScreen
      trayType="extemporaneos"
      title="Bandeja Extemporaneos"
      description="Consulta registros extemporaneos con filtros por periodo, fecha o numero de FUA."
      headerAccentClass="bg-orange-500/10"
      headerIconColorClass="text-orange-300"
      exportFileName="FuasExtemporaneos.xlsx"
    />
  )
}

