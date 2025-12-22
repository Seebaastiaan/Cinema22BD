// NOTA: Este archivo ahora utiliza localStorage en lugar de SQL
// Todas las funciones mantienen la misma firma para compatibilidad
import {
  actualizarPelicula as actualizarPeliculaLS,
  actualizarSinopsisSP as actualizarSinopsisSPLS,
  buscarPeliculas as buscarPeliculasLS,
  crearHorarioFuncion as crearHorarioFuncionLS,
  crearPelicula as crearPeliculaLS,
  getCapsulasByPelicula as getCapsulasByPeliculaLS,
  getCarteleraPorTipo as getCarteleraPorTipoLS,
  getCineCapsulas as getCineCapsulaLS,
  getDashboardStats as getDashboardStatsLS,
  getDirectores as getDirectoresLS,
  getDuracionPromedioPorPais as getDuracionPromedioPorPaisLS,
  getFuncionesProximas as getFuncionesProximasLS,
  getHorariosByPelicula as getHorariosByPeliculaLS,
  getHorariosFunciones as getHorariosFuncionesLS,
  getPeliculaById as getPeliculaByIdLS,
  getPeliculas as getPeliculasLS,
  getPeliculasPorDirectorEspecifico as getPeliculasPorDirectorEspecificoLS,
  getPeliculasPorDirector as getPeliculasPorDirectorLS,
  getPeliculasPorTipoCine as getPeliculasPorTipoCineLS,
  getTiposCine as getTiposCineLS,
} from "./localStorage";

import type {
  CineCapsula,
  DashboardStats,
  Director,
  HorarioFuncion,
  Pelicula,
  TipoCine,
} from "./types";

// Todas las funciones ahora son síncronas pero mantienen la interfaz async para compatibilidad
export async function getDashboardStats(): Promise<DashboardStats> {
  return getDashboardStatsLS();
}

export async function getPeliculas(): Promise<Pelicula[]> {
  return getPeliculasLS();
}

export async function getPeliculaById(id: number): Promise<Pelicula | null> {
  return getPeliculaByIdLS(id);
}

export async function getHorariosByPelicula(
  idPelicula: number
): Promise<HorarioFuncion[]> {
  return getHorariosByPeliculaLS(idPelicula);
}

export async function getCapsulasByPelicula(
  idPelicula: number
): Promise<CineCapsula[]> {
  return getCapsulasByPeliculaLS(idPelicula);
}

export async function getHorariosFunciones(): Promise<
  (HorarioFuncion & {
    titulo_original: string;
    titulo_espanol: string | null | undefined;
  })[]
> {
  return getHorariosFuncionesLS();
}

export async function getCineCapsulas(): Promise<CineCapsula[]> {
  return getCineCapsulaLS();
}

export async function getDirectores(): Promise<Director[]> {
  return getDirectoresLS();
}

export async function getTiposCine(): Promise<TipoCine[]> {
  return getTiposCineLS();
}

export async function crearPelicula(data: {
  titulo_original: string;
  titulo_espanol: string | null;
  sinopsis: string | null;
  anio_lanzamiento: number;
  pais_origen: string | null;
  duracion_minutos: number | null;
  ficha_tecnica_resumen: string | null;
  id_director: number | null;
  id_tipo_cine: number | null;
}): Promise<{ success: boolean; id?: number; message: string }> {
  return crearPeliculaLS(data);
}

export async function crearHorarioFuncion(data: {
  fecha_hora_transmision: string;
  id_pelicula: number;
}): Promise<{ success: boolean; id?: number; message: string }> {
  return crearHorarioFuncionLS(data);
}

export async function actualizarPelicula(
  id: number,
  data: {
    titulo_original?: string;
    titulo_espanol?: string | null;
    sinopsis?: string | null;
    anio_lanzamiento?: number;
    pais_origen?: string | null;
    duracion_minutos?: number | null;
    ficha_tecnica_resumen?: string | null;
    id_director?: number | null;
    id_tipo_cine?: number | null;
  }
): Promise<{ success: boolean; message: string }> {
  return actualizarPeliculaLS(id, data);
}

export async function actualizarSinopsisSP(
  id_pelicula: number,
  nueva_sinopsis: string
): Promise<{ success: boolean; message: string }> {
  return actualizarSinopsisSPLS(id_pelicula, nueva_sinopsis);
}

export async function buscarPeliculas(busqueda: string): Promise<Pelicula[]> {
  return buscarPeliculasLS(busqueda);
}

export async function getCarteleraPorTipo(nombreTipo: string) {
  return getCarteleraPorTipoLS(nombreTipo);
}

export async function getPeliculasPorDirector(nombreDirector: string) {
  return getPeliculasPorDirectorLS(nombreDirector);
}

export async function getPeliculasPorTipoCine() {
  return getPeliculasPorTipoCineLS();
}

export async function getDuracionPromedioPorPais() {
  return getDuracionPromedioPorPaisLS();
}

export async function getFuncionesProximas() {
  return getFuncionesProximasLS();
}

export async function getPeliculasPorDirectorEspecifico(directores: string[]) {
  return getPeliculasPorDirectorEspecificoLS(directores);
}
