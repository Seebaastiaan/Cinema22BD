import { ConsultasEspeciales } from "@/components/consultas-especiales";
import { PeliculaCard } from "@/components/pelicula-card";
import { StatsCards } from "@/components/stats-cards";
import { getDashboardStats, getPeliculas } from "@/lib/actions";
import { Film } from "lucide-react";

export const metadata = {
  title: "Cinema 22 - Dashboard",
  description:
    "Plataforma de gestión y visualización del catálogo de Cinema 22",
};

export default async function Home() {
  const [stats, peliculas] = await Promise.all([
    getDashboardStats(),
    getPeliculas(),
  ]);

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:to-slate-900">
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-4 mb-4 p-6 bg-linear-to-r from-purple-600 to-pink-600 rounded-2xl shadow-2xl">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Film className="h-10 w-10 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-5xl font-bold tracking-tight text-white">
                Cinema 22
              </h1>
              <p className="text-purple-100 text-lg mt-1">
                Tu portal de cine de autor
              </p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-xl max-w-2xl mx-auto">
            Explora nuestro catálogo exclusivo de películas y descubre funciones
            especiales
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <StatsCards stats={stats} />
        </div>

        {/* Movies Grid */}
        <div className="space-y-8">
          <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
            <div>
              <h2 className="text-3xl font-bold tracking-tight bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Catálogo de Películas
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Descubre nuestra selección exclusiva
              </p>
            </div>
            <div className="flex items-center gap-2 bg-linear-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 px-4 py-2 rounded-full">
              <Film className="h-4 w-4 text-purple-600 dark:text-purple-300" />
              <span className="text-sm font-semibold text-purple-700 dark:text-purple-200">
                {peliculas.length} películas
              </span>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {peliculas.map((pelicula) => (
              <PeliculaCard key={pelicula.id_pelicula} pelicula={pelicula} />
            ))}
          </div>
        </div>

        {/* Consultas Especiales */}
        <div className="mt-16">
          <ConsultasEspeciales />
        </div>
      </main>
    </div>
  );
}
