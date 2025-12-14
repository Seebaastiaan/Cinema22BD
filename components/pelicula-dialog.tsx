"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getCapsulasByPelicula,
  getHorariosByPelicula,
  getPeliculaById,
} from "@/lib/actions";
import { CineCapsula, HorarioFuncion, Pelicula } from "@/lib/types";
import { formatDate, formatDuration } from "@/lib/utils";
import { Calendar, Clock, MapPin, Play, Users } from "lucide-react";
import { useEffect, useState } from "react";

interface PeliculaDialogProps {
  peliculaId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PeliculaDialog({
  peliculaId,
  open,
  onOpenChange,
}: PeliculaDialogProps) {
  const [pelicula, setPelicula] = useState<Pelicula | null>(null);
  const [horarios, setHorarios] = useState<HorarioFuncion[]>([]);
  const [capsulas, setCapsulas] = useState<CineCapsula[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !peliculaId) {
      return;
    }

    let cancelled = false;

    async function loadData() {
      try {
        setLoading(true);
        const [peliculaData, horariosData, capsulasData] = await Promise.all([
          getPeliculaById(peliculaId),
          getHorariosByPelicula(peliculaId),
          getCapsulasByPelicula(peliculaId),
        ]);

        if (!cancelled) {
          setPelicula(peliculaData);
          setHorarios(horariosData);
          setCapsulas(capsulasData);
          setLoading(false);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Error loading pelicula details:", error);
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [peliculaId, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-linear-to-br from-white to-purple-50 dark:from-slate-900 dark:to-purple-950">
        {loading ? (
          <>
            <DialogHeader className="border-b-2 border-purple-200 dark:border-purple-800 pb-4">
              <DialogTitle className="text-2xl bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Cargando...
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 p-4">
              <Skeleton className="h-10 w-3/4 bg-purple-200 dark:bg-purple-900" />
              <Skeleton className="h-6 w-full bg-purple-100 dark:bg-purple-800" />
              <Skeleton className="h-6 w-full bg-purple-100 dark:bg-purple-800" />
              <Skeleton className="h-40 w-full bg-purple-200 dark:bg-purple-900 rounded-xl" />
            </div>
          </>
        ) : pelicula ? (
          <>
            <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-purple-500 via-pink-500 to-orange-500"></div>
            <DialogHeader className="border-b-2 border-purple-200 dark:border-purple-800 pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <DialogTitle className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {pelicula.titulo_espanol || pelicula.titulo_original}
                  </DialogTitle>
                  {pelicula.titulo_espanol && (
                    <DialogDescription className="text-lg italic mt-2 text-gray-600 dark:text-gray-400">
                      {pelicula.titulo_original}
                    </DialogDescription>
                  )}
                </div>
                <Badge
                  variant="secondary"
                  className="text-lg px-4 py-2 bg-linear-to-r from-purple-600 to-pink-600 text-white border-none font-bold"
                >
                  {pelicula.anio_lanzamiento}
                </Badge>
              </div>
            </DialogHeader>

            <div className="space-y-6 p-2">
              {/* Info básica */}
              <div className="flex flex-wrap gap-3">
                {pelicula.director_nombre && (
                  <div className="flex items-center gap-2 bg-linear-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 px-4 py-2 rounded-full">
                    <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span className="font-semibold text-purple-900 dark:text-purple-100">
                      {pelicula.director_nombre}
                    </span>
                  </div>
                )}
                {pelicula.duracion_minutos && (
                  <div className="flex items-center gap-2 bg-linear-to-r from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900 px-4 py-2 rounded-full">
                    <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-semibold text-blue-900 dark:text-blue-100">
                      {formatDuration(pelicula.duracion_minutos)}
                    </span>
                  </div>
                )}
                {pelicula.pais_origen && (
                  <div className="flex items-center gap-2 bg-linear-to-r from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 px-4 py-2 rounded-full">
                    <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="font-semibold text-green-900 dark:text-green-100">
                      {pelicula.pais_origen}
                    </span>
                  </div>
                )}
              </div>

              {pelicula.tipo_cine_nombre && (
                <div>
                  <Badge
                    variant="outline"
                    className="text-sm border-2 border-purple-400 text-purple-700 dark:text-purple-300 dark:border-purple-600 px-4 py-1.5"
                  >
                    🎬 {pelicula.tipo_cine_nombre}
                  </Badge>
                </div>
              )}

              {/* Sinopsis */}
              {pelicula.sinopsis && (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
                  <h4 className="font-bold text-lg mb-3 text-purple-700 dark:text-purple-300">
                    📖 Sinopsis
                  </h4>
                  <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    {pelicula.sinopsis}
                  </p>
                </div>
              )}

              {/* Ficha técnica */}
              {pelicula.ficha_tecnica_resumen && (
                <div className="bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
                  <h4 className="font-bold text-lg mb-3 text-blue-700 dark:text-blue-300">
                    🎥 Ficha Técnica
                  </h4>
                  <p className="text-base text-gray-700 dark:text-gray-300">
                    {pelicula.ficha_tecnica_resumen}
                  </p>
                </div>
              )}

              {/* Horarios de función */}
              {horarios.length > 0 && (
                <div className="bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-6 rounded-xl shadow-lg">
                  <h4 className="font-bold text-xl mb-4 flex items-center gap-3 text-purple-700 dark:text-purple-300">
                    <div className="p-2 bg-purple-200 dark:bg-purple-800 rounded-lg">
                      <Calendar className="h-6 w-6" />
                    </div>
                    Horarios de Función
                  </h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    {horarios.map((horario) => (
                      <Card
                        key={horario.id_horario}
                        className="border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all hover:scale-105"
                      >
                        <CardContent className="p-4 bg-white dark:bg-slate-800">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                              <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <span className="font-semibold text-gray-800 dark:text-gray-200">
                              {formatDate(horario.fecha_hora_transmision)}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Cine Cápsulas */}
              {capsulas.length > 0 && (
                <div className="bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 p-6 rounded-xl shadow-lg">
                  <h4 className="font-bold text-xl mb-4 flex items-center gap-3 text-green-700 dark:text-green-300">
                    <div className="p-2 bg-green-200 dark:bg-green-800 rounded-lg">
                      <Play className="h-6 w-6" />
                    </div>
                    Cine Cápsulas Relacionadas
                  </h4>
                  <div className="space-y-4">
                    {capsulas.map((capsula) => (
                      <Card
                        key={capsula.id_capsula}
                        className="border-2 border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600 transition-all hover:scale-102 overflow-hidden"
                      >
                        <div className="h-1 bg-linear-to-r from-green-400 to-emerald-400"></div>
                        <CardHeader className="p-5 bg-white dark:bg-slate-800">
                          <CardTitle className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <Play className="h-4 w-4 text-green-600 dark:text-green-400" />
                            {capsula.titulo_capsula}
                          </CardTitle>
                          {capsula.descripcion && (
                            <CardDescription className="text-sm mt-2 text-gray-600 dark:text-gray-400">
                              {capsula.descripcion}
                            </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent className="p-5 pt-0 bg-white dark:bg-slate-800">
                          <div className="flex gap-4">
                            {capsula.duracion_minutos && (
                              <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full">
                                <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                                  {capsula.duracion_minutos}min
                                </span>
                              </div>
                            )}
                            {capsula.fecha_transmision && (
                              <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900 px-3 py-1 rounded-full">
                                <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                <span className="text-sm font-semibold text-purple-800 dark:text-purple-200">
                                  {formatDate(capsula.fecha_transmision)}
                                </span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Película no encontrada</DialogTitle>
            </DialogHeader>
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No se encontró información de la película
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
