import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStats } from "@/lib/types";
import { Calendar, Film, Play, Users } from "lucide-react";

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-none bg-linear-to-br from-purple-500 to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold">
            Total Películas
          </CardTitle>
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Film className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.totalPeliculas}</div>
          <p className="text-xs text-purple-100 mt-1">En catálogo completo</p>
        </CardContent>
      </Card>

      <Card className="border-none bg-linear-to-br from-blue-500 to-blue-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold">Funciones</CardTitle>
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Calendar className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.totalFunciones}</div>
          <p className="text-xs text-blue-100 mt-1">Programadas</p>
        </CardContent>
      </Card>

      <Card className="border-none bg-linear-to-br from-green-500 to-green-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold">Cine Cápsulas</CardTitle>
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Play className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.totalCapsulas}</div>
          <p className="text-xs text-green-100 mt-1">
            Material extra disponible
          </p>
        </CardContent>
      </Card>

      <Card className="border-none bg-linear-to-br from-orange-500 to-orange-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold">Directores</CardTitle>
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Users className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.totalDirectores}</div>
          <p className="text-xs text-orange-100 mt-1">En nuestra colección</p>
        </CardContent>
      </Card>
    </div>
  );
}
