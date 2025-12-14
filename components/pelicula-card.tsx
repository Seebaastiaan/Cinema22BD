"use client";

import { PeliculaDialog } from "@/components/pelicula-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pelicula } from "@/lib/types";
import { formatDuration } from "@/lib/utils";
import { Clock, Eye, MapPin, Users } from "lucide-react";
import { useState } from "react";

interface PeliculaCardProps {
  pelicula: Pelicula;
}

export function PeliculaCard({ pelicula }: PeliculaCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Card className="flex flex-col hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 hover:border-purple-300 dark:hover:border-purple-600 overflow-hidden group">
        <div className="h-2 bg-linear-to-r from-purple-500 via-pink-500 to-orange-500"></div>
        <CardHeader className="bg-linear-to-br from-white to-purple-50 dark:from-slate-800 dark:to-purple-900/20">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <CardTitle className="text-xl line-clamp-2 font-bold text-gray-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {pelicula.titulo_espanol || pelicula.titulo_original}
              </CardTitle>
              {pelicula.titulo_espanol && (
                <CardDescription className="text-sm italic mt-2 text-gray-600 dark:text-gray-400">
                  {pelicula.titulo_original}
                </CardDescription>
              )}
            </div>
            <Badge
              variant="secondary"
              className="shrink-0 bg-linear-to-r from-purple-600 to-pink-600 text-white border-none px-3 py-1 text-sm font-bold"
            >
              {pelicula.anio_lanzamiento}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-4 bg-white dark:bg-slate-800">
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-4 leading-relaxed">
            {pelicula.sinopsis}
          </p>

          <div className="space-y-3 text-sm">
            {pelicula.director_nombre && (
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 bg-purple-50 dark:bg-purple-900/20 p-2 rounded-lg">
                <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span className="font-semibold">
                  {pelicula.director_nombre}
                </span>
              </div>
            )}

            {pelicula.tipo_cine_nombre && (
              <Badge
                variant="outline"
                className="text-xs border-purple-300 text-purple-700 dark:text-purple-300 dark:border-purple-600"
              >
                🎬 {pelicula.tipo_cine_nombre}
              </Badge>
            )}

            <div className="flex flex-wrap gap-4 pt-2">
              {pelicula.duracion_minutos && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">
                    {formatDuration(pelicula.duracion_minutos)}
                  </span>
                </div>
              )}

              {pelicula.pais_origen && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <MapPin className="h-4 w-4 text-green-500" />
                  <span className="font-medium">{pelicula.pais_origen}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-linear-to-r from-purple-50 to-pink-50 dark:from-slate-800 dark:to-purple-900/20">
          <Button
            onClick={() => setDialogOpen(true)}
            className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-6 shadow-lg hover:shadow-xl transition-all"
          >
            <Eye className="mr-2 h-5 w-5" />
            Ver Detalles Completos
          </Button>
        </CardFooter>
      </Card>

      <PeliculaDialog
        peliculaId={pelicula.id_pelicula}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}
