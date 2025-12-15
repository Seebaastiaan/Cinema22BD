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
import {
  actualizarPelicula,
  actualizarSinopsisSP,
  buscarPeliculas,
  getDirectores,
  getTiposCine,
} from "@/lib/actions";
import type { Director, Pelicula, TipoCine } from "@/lib/types";
import { AlertCircle, CheckCircle2, Edit, Film, Search } from "lucide-react";
import { useEffect, useState } from "react";

export function EditarPelicula() {
  const [directores, setDirectores] = useState<Director[]>([]);
  const [tiposCine, setTiposCine] = useState<TipoCine[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error" | null;
    text: string;
  }>({ type: null, text: "" });

  // Búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Pelicula[]>([]);
  const [selectedPelicula, setSelectedPelicula] = useState<Pelicula | null>(
    null
  );

  // Formulario de edición
  const [editForm, setEditForm] = useState({
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

  // Modo de edición de sinopsis
  const [usarSP, setUsarSP] = useState(false);

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

  // Cargar datos de película seleccionada al formulario
  useEffect(() => {
    if (selectedPelicula) {
      setEditForm({
        titulo_original: selectedPelicula.titulo_original,
        titulo_espanol: selectedPelicula.titulo_espanol || "",
        sinopsis: selectedPelicula.sinopsis || "",
        anio_lanzamiento: selectedPelicula.anio_lanzamiento,
        pais_origen: selectedPelicula.pais_origen || "",
        duracion_minutos: selectedPelicula.duracion_minutos?.toString() || "",
        ficha_tecnica_resumen: selectedPelicula.ficha_tecnica_resumen || "",
        id_director: selectedPelicula.id_director?.toString() || "",
        id_tipo_cine: selectedPelicula.id_tipo_cine?.toString() || "",
      });
    }
  }, [selectedPelicula]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setSearching(true);
    try {
      const results = await buscarPeliculas(searchTerm);
      setSearchResults(results);
      if (results.length === 0) {
        setMessage({
          type: "error",
          text: "No se encontraron películas con ese término",
        });
      } else {
        setMessage({ type: null, text: "" });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Error al buscar películas",
      });
    } finally {
      setSearching(false);
    }
  };

  const handleSelectPelicula = (pelicula: Pelicula) => {
    setSelectedPelicula(pelicula);
    setSearchResults([]);
    setSearchTerm("");
    setMessage({ type: null, text: "" });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPelicula) return;

    setLoading(true);
    setMessage({ type: null, text: "" });

    try {
      let result;

      // Si está activado el modo SP y se modificó la sinopsis, usar el Stored Procedure
      if (usarSP && editForm.sinopsis !== selectedPelicula.sinopsis) {
        result = await actualizarSinopsisSP(
          selectedPelicula.id_pelicula,
          editForm.sinopsis
        );
      } else {
        // Actualización normal
        result = await actualizarPelicula(selectedPelicula.id_pelicula, {
          titulo_original: editForm.titulo_original,
          titulo_espanol: editForm.titulo_espanol || null,
          sinopsis: editForm.sinopsis || null,
          anio_lanzamiento: editForm.anio_lanzamiento,
          pais_origen: editForm.pais_origen || null,
          duracion_minutos: editForm.duracion_minutos
            ? parseInt(editForm.duracion_minutos)
            : null,
          ficha_tecnica_resumen: editForm.ficha_tecnica_resumen || null,
          id_director: editForm.id_director
            ? parseInt(editForm.id_director)
            : null,
          id_tipo_cine: editForm.id_tipo_cine
            ? parseInt(editForm.id_tipo_cine)
            : null,
        });
      }

      if (result.success) {
        setMessage({
          type: "success",
          text: result.message,
        });
        // Limpiar selección después de 3 segundos
        setTimeout(() => {
          setSelectedPelicula(null);
        }, 3000);
      } else {
        setMessage({ type: "error", text: result.message });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Error al actualizar la película",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
          Editar Película
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Busca y modifica los datos de películas existentes
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

      {/* Búsqueda */}
      <Card className="border-2 border-blue-200 dark:border-blue-800 shadow-xl">
        <CardHeader className="bg-linear-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-linear-to-br from-blue-500 to-cyan-500 rounded-xl text-white">
              <Search className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-2xl">Buscar Película</CardTitle>
              <CardDescription className="text-sm mt-1">
                Ingresa el título original o en español
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ej: Roma, The Godfather, Parasite..."
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button
              type="submit"
              disabled={searching || !searchTerm.trim()}
              className="bg-linear-to-r from-blue-600 to-cyan-600 hover:opacity-90 text-white font-semibold px-6"
            >
              {searching ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Buscando...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5" />
                  Buscar
                </>
              )}
            </Button>
          </form>

          {/* Resultados de búsqueda */}
          {searchResults.length > 0 && (
            <div className="mt-6 space-y-2">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Resultados ({searchResults.length}):
              </p>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {searchResults.map((pelicula) => (
                  <button
                    key={pelicula.id_pelicula}
                    onClick={() => handleSelectPelicula(pelicula)}
                    className="w-full text-left p-4 bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {pelicula.titulo_espanol || pelicula.titulo_original}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {pelicula.titulo_original} ({pelicula.anio_lanzamiento})
                        </p>
                        <div className="flex gap-2 mt-2">
                          {pelicula.director_nombre && (
                            <Badge variant="outline" className="text-xs">
                              {pelicula.director_nombre}
                            </Badge>
                          )}
                          {pelicula.tipo_cine_nombre && (
                            <Badge variant="outline" className="text-xs">
                              {pelicula.tipo_cine_nombre}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Badge className="bg-blue-500">ID: {pelicula.id_pelicula}</Badge>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Formulario de edición */}
      {selectedPelicula && (
        <Card className="border-2 border-cyan-200 dark:border-cyan-800 shadow-xl">
          <CardHeader className="bg-linear-to-r from-cyan-50 to-blue-50 dark:from-cyan-950 dark:to-blue-950">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-linear-to-br from-cyan-500 to-blue-500 rounded-xl text-white">
                <Edit className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl">
                  Editar: {selectedPelicula.titulo_espanol || selectedPelicula.titulo_original}
                </CardTitle>
                <CardDescription className="text-sm mt-1">
                  ID: {selectedPelicula.id_pelicula} | Modifica los campos necesarios
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Título Original */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Título Original <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.titulo_original}
                    onChange={(e) =>
                      setEditForm({ ...editForm, titulo_original: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>

                {/* Título Español */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Título en Español
                  </label>
                  <input
                    type="text"
                    value={editForm.titulo_espanol}
                    onChange={(e) =>
                      setEditForm({ ...editForm, titulo_espanol: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
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
                    value={editForm.anio_lanzamiento}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        anio_lanzamiento: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>

                {/* País */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    País de Origen
                  </label>
                  <input
                    type="text"
                    value={editForm.pais_origen}
                    onChange={(e) =>
                      setEditForm({ ...editForm, pais_origen: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>

                {/* Duración */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Duración (minutos)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editForm.duracion_minutos}
                    onChange={(e) =>
                      setEditForm({ ...editForm, duracion_minutos: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>

                {/* Director */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Director
                  </label>
                  <select
                    value={editForm.id_director}
                    onChange={(e) =>
                      setEditForm({ ...editForm, id_director: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar...</option>
                    {directores.map((director) => (
                      <option key={director.id_director} value={director.id_director}>
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
                    value={editForm.id_tipo_cine}
                    onChange={(e) =>
                      setEditForm({ ...editForm, id_tipo_cine: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
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
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Sinopsis
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={usarSP}
                      onChange={(e) => setUsarSP(e.target.checked)}
                      className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                    />
                    <span className="text-gray-600 dark:text-gray-400">
                      Usar SP_ActualizarSinopsis
                    </span>
                  </label>
                </div>
                <textarea
                  rows={4}
                  value={editForm.sinopsis}
                  onChange={(e) =>
                    setEditForm({ ...editForm, sinopsis: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                  placeholder="Descripción de la película..."
                />
                {usarSP && (
                  <p className="text-xs text-cyan-600 dark:text-cyan-400">
                    ✓ Se usará el Stored Procedure para actualizar solo la sinopsis
                  </p>
                )}
              </div>

              {/* Ficha Técnica */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Ficha Técnica (Resumen)
                </label>
                <textarea
                  rows={3}
                  value={editForm.ficha_tecnica_resumen}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      ficha_tecnica_resumen: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                  placeholder="Información técnica adicional..."
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={() => setSelectedPelicula(null)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-linear-to-r from-cyan-600 to-blue-600 hover:opacity-90 text-white font-semibold py-3"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Actualizando...
                    </>
                  ) : (
                    <>
                      <Film className="mr-2 h-5 w-5" />
                      Guardar Cambios
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
