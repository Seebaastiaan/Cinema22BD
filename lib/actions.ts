"use server";

import { query } from "./db";
import {
  CineCapsula,
  DashboardStats,
  Director,
  HorarioFuncion,
  Pelicula,
  TipoCine,
  CarteleraPorTipo,
  PeliculasPorDirectorCount,
  PeliculasPorTipoCine,
  DuracionPromedioPorPais,
  FuncionProxima,
  PeliculaPorDirectorEspecifico,
} from "./types";

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [peliculasCount] = await query<{ total: number }>(
      "SELECT COUNT(*) as total FROM pelicula"
    );

    const [funcionesCount] = await query<{ total: number }>(
      "SELECT COUNT(*) as total FROM horario_funcion"
    );

    const [capsulasCount] = await query<{ total: number }>(
      "SELECT COUNT(*) as total FROM cine_capsula"
    );

    const [directoresCount] = await query<{ total: number }>(
      "SELECT COUNT(*) as total FROM director"
    );

    const proximaFuncion = await query<
      HorarioFuncion & { titulo_original: string }
    >(
      `SELECT hf.*, p.titulo_original 
       FROM horario_funcion hf
       JOIN pelicula p ON hf.id_pelicula = p.id_pelicula
       WHERE hf.fecha_hora_transmision > NOW()
       ORDER BY hf.fecha_hora_transmision ASC
       LIMIT 1`
    );

    return {
      totalPeliculas: peliculasCount.total,
      totalFunciones: funcionesCount.total,
      totalCapsulas: capsulasCount.total,
      totalDirectores: directoresCount.total,
      proximaFuncion: proximaFuncion[0] || undefined,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
}

export async function getPeliculas(): Promise<Pelicula[]> {
  try {
    const peliculas = await query<Pelicula>(
      `SELECT 
        p.*,
        d.nombre_completo as director_nombre,
        tc.nombre_tipo as tipo_cine_nombre
       FROM pelicula p
       LEFT JOIN director d ON p.id_director = d.id_director
       LEFT JOIN tipo_cine tc ON p.id_tipo_cine = tc.id_tipo
       ORDER BY p.anio_lanzamiento DESC`
    );
    return peliculas;
  } catch (error) {
    console.error("Error fetching peliculas:", error);
    throw error;
  }
}

export async function getPeliculaById(id: number): Promise<Pelicula | null> {
  try {
    const peliculas = await query<Pelicula>(
      `SELECT 
        p.*,
        d.nombre_completo as director_nombre,
        tc.nombre_tipo as tipo_cine_nombre
       FROM pelicula p
       LEFT JOIN director d ON p.id_director = d.id_director
       LEFT JOIN tipo_cine tc ON p.id_tipo_cine = tc.id_tipo
       WHERE p.id_pelicula = ?`,
      [id]
    );
    return peliculas[0] || null;
  } catch (error) {
    console.error("Error fetching pelicula:", error);
    throw error;
  }
}

export async function getHorariosByPelicula(
  idPelicula: number
): Promise<HorarioFuncion[]> {
  try {
    return await query<HorarioFuncion>(
      `SELECT * FROM horario_funcion 
       WHERE id_pelicula = ? 
       ORDER BY fecha_hora_transmision ASC`,
      [idPelicula]
    );
  } catch (error) {
    console.error("Error fetching horarios:", error);
    throw error;
  }
}

export async function getCapsulasByPelicula(
  idPelicula: number
): Promise<CineCapsula[]> {
  try {
    return await query<CineCapsula>(
      `SELECT * FROM cine_capsula 
       WHERE id_pelicula = ? 
       ORDER BY fecha_transmision ASC`,
      [idPelicula]
    );
  } catch (error) {
    console.error("Error fetching capsulas:", error);
    throw error;
  }
}

export async function getHorariosFunciones(): Promise<
  (HorarioFuncion & {
    titulo_original: string;
    titulo_espanol: string | null;
  })[]
> {
  try {
    return await query<
      HorarioFuncion & {
        titulo_original: string;
        titulo_espanol: string | null;
      }
    >(
      `SELECT 
        hf.*,
        p.titulo_original,
        p.titulo_espanol,
        p.duracion_minutos
       FROM horario_funcion hf
       JOIN pelicula p ON hf.id_pelicula = p.id_pelicula
       ORDER BY hf.fecha_hora_transmision DESC
       LIMIT 50`
    );
  } catch (error) {
    console.error("Error fetching horarios funciones:", error);
    throw error;
  }
}

export async function getCineCapsulas(): Promise<CineCapsula[]> {
  try {
    return await query<CineCapsula>(
      `SELECT 
        cc.*,
        p.titulo_original as pelicula_titulo
       FROM cine_capsula cc
       LEFT JOIN pelicula p ON cc.id_pelicula = p.id_pelicula
       ORDER BY cc.fecha_transmision DESC`
    );
  } catch (error) {
    console.error("Error fetching cine capsulas:", error);
    throw error;
  }
}

export async function getDirectores(): Promise<Director[]> {
  try {
    return await query<Director>(
      "SELECT * FROM director ORDER BY nombre_completo ASC"
    );
  } catch (error) {
    console.error("Error fetching directores:", error);
    throw error;
  }
}

export async function getTiposCine(): Promise<TipoCine[]> {
  try {
    return await query<TipoCine>(
      "SELECT * FROM tipo_cine ORDER BY nombre_tipo ASC"
    );
  } catch (error) {
    console.error("Error fetching tipos cine:", error);
    throw error;
  }
}

// Consultas SQL Especiales del proyecto1_1.sql

export async function getCarteleraPorTipo(nombreTipo: string) {
  try {
    return await query<CarteleraPorTipo>(
      `SELECT 
        tc.nombre_tipo AS Tipo_Cine,
        p.titulo_espanol AS Titulo_Pelicula,
        d.nombre_completo AS Director,
        hf.fecha_hora_transmision AS Horario
      FROM pelicula p
      JOIN tipo_cine tc ON p.id_tipo_cine = tc.id_tipo
      JOIN director d ON p.id_director = d.id_director
      JOIN horario_funcion hf ON p.id_pelicula = hf.id_pelicula
      WHERE tc.nombre_tipo = ?
      ORDER BY hf.fecha_hora_transmision`,
      [nombreTipo]
    );
  } catch (error) {
    console.error("Error fetching cartelera por tipo:", error);
    throw error;
  }
}

export async function getPeliculasPorDirector(nombreDirector: string) {
  try {
    return await query<PeliculasPorDirectorCount>(
      `SELECT COUNT(p.id_pelicula) as total
      FROM pelicula p
      JOIN director d ON p.id_director = d.id_director
      WHERE d.nombre_completo = ?`,
      [nombreDirector]
    );
  } catch (error) {
    console.error("Error counting peliculas por director:", error);
    throw error;
  }
}

export async function getPeliculasPorTipoCine() {
  try {
    return await query<PeliculasPorTipoCine>(
      `SELECT 
        tc.nombre_tipo AS Tipo_Cine,
        COUNT(p.id_pelicula) AS Total_Peliculas
      FROM tipo_cine tc
      LEFT JOIN pelicula p ON tc.id_tipo = p.id_tipo_cine
      GROUP BY tc.nombre_tipo
      ORDER BY Total_Peliculas DESC`
    );
  } catch (error) {
    console.error("Error fetching peliculas por tipo cine:", error);
    throw error;
  }
}

export async function getDuracionPromedioPorPais() {
  try {
    return await query<DuracionPromedioPorPais>(
      `SELECT
        pais_origen AS Pais_Origen,
        AVG(duracion_minutos) AS Duracion_Promedio,
        COUNT(id_pelicula) AS Numero_Peliculas
      FROM pelicula
      GROUP BY pais_origen
      HAVING COUNT(id_pelicula) >= 2
      ORDER BY Duracion_Promedio DESC`
    );
  } catch (error) {
    console.error("Error fetching duracion promedio por pais:", error);
    throw error;
  }
}

export async function getFuncionesProximas() {
  try {
    return await query<FuncionProxima>(
      `SELECT 
        hf.fecha_hora_transmision AS Horario,
        p.titulo_espanol AS Titulo_Pelicula,
        d.nombre_completo AS Director,
        tc.nombre_tipo AS Tipo_Cine
      FROM horario_funcion hf
      JOIN pelicula p ON hf.id_pelicula = p.id_pelicula
      JOIN director d ON p.id_director = d.id_director
      JOIN tipo_cine tc ON p.id_tipo_cine = tc.id_tipo
      WHERE hf.fecha_hora_transmision >= NOW()
      ORDER BY hf.fecha_hora_transmision
      LIMIT 10`
    );
  } catch (error) {
    console.error("Error fetching funciones proximas:", error);
    throw error;
  }
}

export async function getPeliculasPorDirectorEspecifico(directores: string[]) {
  try {
    const placeholders = directores.map(() => "?").join(",");
    return await query<PeliculaPorDirectorEspecifico>(
      `SELECT
        hf.fecha_hora_transmision AS Horario,
        p.titulo_espanol AS Titulo_Pelicula,
        d.nombre_completo AS Director,
        p.duracion_minutos AS Duracion_Minutos
      FROM horario_funcion hf
      JOIN pelicula p ON hf.id_pelicula = p.id_pelicula
      JOIN director d ON p.id_director = d.id_director
      WHERE d.nombre_completo IN (${placeholders})
      ORDER BY d.nombre_completo, hf.fecha_hora_transmision`,
      directores
    );
  } catch (error) {
    console.error("Error fetching peliculas por director especifico:", error);
    throw error;
  }
}
