"use client";

import { AltaPelicula } from "@/components/alta-pelicula";
import { ConsultasEspeciales } from "@/components/consultas-especiales";
import { EditarPelicula } from "@/components/editar-pelicula";
import { PeliculaCard } from "@/components/pelicula-card";
import { StatsCards } from "@/components/stats-cards";
import { getDashboardStats, getPeliculas } from "@/lib/actions";
import { initializeLocalStorage } from "@/lib/localStorage";
import type { DashboardStats, Pelicula } from "@/lib/types";
import { Database, Edit, Film, Home as HomeIcon, Plus } from "lucide-react";
import { useEffect, useState } from "react";

type Section = "home" | "alta" | "editar" | "consultas";

export default function HomePage() {
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Marcar como montado para evitar hidration mismatch
    setMounted(true);
    
    // Inicializar localStorage con todos los datos de SQL
    initializeLocalStorage();

    async function loadData() {
      try {
        const [statsData, peliculasData] = await Promise.all([
          getDashboardStats(),
          getPeliculas(),
        ]);
        setStats(statsData);
        setPeliculas(peliculasData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // No renderizar nada hasta que esté montado en el cliente
  if (!mounted) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: "home" as Section, label: "Inicio", icon: HomeIcon },
    { id: "alta" as Section, label: "Alta de Película", icon: Plus },
    { id: "editar" as Section, label: "Editar Película", icon: Edit },
    { id: "consultas" as Section, label: "Consultas SQL", icon: Database },
  ];

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-linear-to-r from-purple-600 to-pink-600 rounded-xl">
                <Film className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Cinema 22
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Sistema de Gestión
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden md:inline">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Home Section */}
        {activeSection === "home" && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div>
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
                  <PeliculaCard
                    key={pelicula.id_pelicula}
                    pelicula={pelicula}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Alta de Película Section */}
        {activeSection === "alta" && <AltaPelicula />}

        {/* Editar Película Section */}
        {activeSection === "editar" && <EditarPelicula />}

        {/* Consultas Especiales Section */}
        {activeSection === "consultas" && <ConsultasEspeciales />}
      </main>
    </div>
  );
}
