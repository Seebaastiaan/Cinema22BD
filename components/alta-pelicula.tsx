"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { crearHorarioFuncion, crearPelicula, getDirectores, getTiposCine } from "@/lib/actions";
import type { Director, TipoCine } from "@/lib/types";
import { AlertCircle, Calendar, CheckCircle2, Film, Plus } from "lucide-react";
import { useEffect, useState } from "react";

export function AltaPelicula() {
  const [directores, setDirectores] = useState<Director[]>([]);
  const [tiposCine, setTiposCine] = useState<TipoCine[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error" | null;
    text: string;
  }>({ type: null, text: "" });

  // Estado del formulario de película
  const [peliculaForm, setPeliculaForm] = useState({
    titulo_original: "",
    titulo_espanol: "",
    sinopsis: "",
    anio_lanzamiento: new Date().getFullYear(),
    pais_origen: "",
    duracion_minutos: "",
    ficha_tecnica_resumen: "",
    id_director: "",
    id_tipo_cine: "",
  });

  // Estado para el horario
  const [peliculaCreada, setPeliculaCreada] = useState<number | null>(null);
  const [horarioForm, setHorarioForm] = useState({
    fecha_hora_transmision: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [directoresData, tiposData] = await Promise.all([
          getDirectores(),
          getTiposCine(),
        ]);
        setDirectores(directoresData);
        setTiposCine(tiposData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    }
    fetchData();
  }, []);

  const handlePeliculaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: null, text: "" });

    try {
      const result = await crearPelicula({
        ...peliculaForm,
        titulo_espanol: peliculaForm.titulo_espanol || null,
        sinopsis: peliculaForm.sinopsis || null,
        pais_origen: peliculaForm.pais_origen || null,
        duracion_minutos: peliculaForm.duracion_minutos
          ? parseInt(peliculaForm.duracion_minutos)
          : null,
        ficha_tecnica_resumen: peliculaForm.ficha_tecnica_resumen || null,
        id_director: peliculaForm.id_director
          ? parseInt(peliculaForm.id_director)
          : null,
        id_tipo_cine: peliculaForm.id_tipo_cine
          ? parseInt(peliculaForm.id_tipo_cine)
          : null,
      });

      if (result.success && result.id) {
        setMessage({
          type: "success",
          text: `${result.message}. ID: ${result.id}`,
        });
        setPeliculaCreada(result.id);
        
        // Limpiar formulario
        setPeliculaForm({
          titulo_original: "",
          titulo_espanol: "",
          sinopsis: "",
          anio_lanzamiento: new Date().getFullYear(),
          pais_origen: "",
          duracion_minutos: "",
          ficha_tecnica_resumen: "",
          id_director: "",
          id_tipo_cine: "",
        });
      } else {
        setMessage({ type: "error", text: result.message });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Error al crear la película",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleHorarioSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!peliculaCreada) return;

    setLoading(true);
    setMessage({ type: null, text: "" });

    try {
      const result = await crearHorarioFuncion({
        fecha_hora_transmision: horarioForm.fecha_hora_transmision,
        id_pelicula: peliculaCreada,
      });

      if (result.success) {
        setMessage({
          type: "success",
          text: result.message,
        });
        setHorarioForm({ fecha_hora_transmision: "" });
      } else {
        setMessage({ type: "error", text: result.message });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Error al crear el horario",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Alta de Película
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Registra una nueva película en el catálogo
        </p>
      </div>

      {/* Mensaje de respuesta */}
      {message.type && (
        <Card
          className={`border-2 ${
            message.type === "success"
              ? "border-green-500 bg-green-50 dark:bg-green-950"
              : "border-red-500 bg-red-50 dark:bg-red-950"
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {message.type === "success" ? (
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              ) : (
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              )}
              <p
                className={`font-medium ${
                  message.type === "success"
                    ? "text-green-800 dark:text-green-200"
                    : "text-red-800 dark:text-red-200"
                }`}
              >
                {message.text}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formulario de Película */}
      <Card className="border-2 border-purple-200 dark:border-purple-800 shadow-xl">
        <CardHeader className="bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-linear-to-br from-purple-500 to-purple-700 rounded-xl text-white">
              <Film className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-2xl">Datos de la Película</CardTitle>
              <CardDescription className="text-sm mt-1">
                El trigger validará automáticamente la duración
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handlePeliculaSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Título Original */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Título Original <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={peliculaForm.titulo_original}
                  onChange={(e) =>
                    setPeliculaForm({
                      ...peliculaForm,
                      titulo_original: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ej: The Godfather"
                />
              </div>

              {/* Título Español */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Título en Español
                </label>
                <input
                  type="text"
                  value={peliculaForm.titulo_espanol}
                  onChange={(e) =>
                    setPeliculaForm({
                      ...peliculaForm,
                      titulo_espanol: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ej: El Padrino"
                />
              </div>

              {/* Año */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Año de Lanzamiento <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1888"
                  max={new Date().getFullYear() + 5}
                  value={peliculaForm.anio_lanzamiento}
                  onChange={(e) =>
                    setPeliculaForm({
                      ...peliculaForm,
                      anio_lanzamiento: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* País */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  País de Origen
                </label>
                <input
                  type="text"
                  value={peliculaForm.pais_origen}
                  onChange={(e) =>
                    setPeliculaForm({
                      ...peliculaForm,
                      pais_origen: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ej: Estados Unidos"
                />
              </div>

              {/* Duración */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Duración (minutos)
                </label>
                <input
                  type="number"
                  min="0"
                  value={peliculaForm.duracion_minutos}
                  onChange={(e) =>
                    setPeliculaForm({
                      ...peliculaForm,
                      duracion_minutos: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="120"
                />
                <p className="text-xs text-gray-500">
                  Si es inválida (≤0 o NULL), el trigger la ajustará a 1
                </p>
              </div>

              {/* Director */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Director
                </label>
                <select
                  value={peliculaForm.id_director}
                  onChange={(e) =>
                    setPeliculaForm({
                      ...peliculaForm,
                      id_director: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Seleccionar...</option>
                  {directores.map((director) => (
                    <option
                      key={director.id_director}
                      value={director.id_director}
                    >
                      {director.nombre_completo}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tipo de Cine */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Tipo de Cine
                </label>
                <select
                  value={peliculaForm.id_tipo_cine}
                  onChange={(e) =>
                    setPeliculaForm({
                      ...peliculaForm,
                      id_tipo_cine: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Seleccionar...</option>
                  {tiposCine.map((tipo) => (
                    <option key={tipo.id_tipo} value={tipo.id_tipo}>
                      {tipo.nombre_tipo}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sinopsis */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Sinopsis
              </label>
              <textarea
                rows={4}
                value={peliculaForm.sinopsis}
                onChange={(e) =>
                  setPeliculaForm({ ...peliculaForm, sinopsis: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="Descripción de la película..."
              />
            </div>

            {/* Ficha Técnica */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Ficha Técnica (Resumen)
              </label>
              <textarea
                rows={3}
                value={peliculaForm.ficha_tecnica_resumen}
                onChange={(e) =>
                  setPeliculaForm({
                    ...peliculaForm,
                    ficha_tecnica_resumen: e.target.value,
                  })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="Información técnica adicional..."
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white font-semibold py-3 text-lg"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-5 w-5" />
                  Crear Película
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Formulario de Horario (solo si hay película creada) */}
      {peliculaCreada && (
        <Card className="border-2 border-orange-200 dark:border-orange-800 shadow-xl">
          <CardHeader className="bg-linear-to-r from-orange-50 to-pink-50 dark:from-orange-950 dark:to-pink-950">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-linear-to-br from-orange-500 to-orange-700 rounded-xl text-white">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-2xl">
                  Agregar Horario de Función
                </CardTitle>
                <CardDescription className="text-sm mt-1">
                  Para la película ID: {peliculaCreada}. Se registrará en
                  log_cartelera
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleHorarioSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Fecha y Hora de Transmisión{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  required
                  value={horarioForm.fecha_hora_transmision}
                  onChange={(e) =>
                    setHorarioForm({
                      fecha_hora_transmision: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <div className="flex items-start gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    Trigger Activo
                  </Badge>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    El trigger TR_AfterInsert_Horario registrará
                    automáticamente esta inserción en la tabla log_cartelera
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-orange-600 to-pink-600 hover:opacity-90 text-white font-semibold py-3 text-lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Calendar className="mr-2 h-5 w-5" />
                    Crear Horario
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
