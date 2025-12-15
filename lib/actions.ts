"use server";

import { query } from "./db";
import {
  CarteleraPorTipo,
  CineCapsula,
  DashboardStats,
  Director,
  DuracionPromedioPorPais,
  FuncionProxima,
  HorarioFuncion,
  Pelicula,
  PeliculaPorDirectorEspecifico,
  PeliculasPorDirectorCount,
  PeliculasPorTipoCine,
  TipoCine,
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

// Crear nueva película (usa el trigger TR_BeforeInsert_Pelicula_Duracion)
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
  try {
    const result = await query<{ insertId: number }>(
      `INSERT INTO pelicula (
        titulo_original, 
        titulo_espanol, 
        sinopsis, 
        anio_lanzamiento, 
        pais_origen, 
        duracion_minutos, 
        ficha_tecnica_resumen, 
        id_director, 
        id_tipo_cine
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.titulo_original,
        data.titulo_espanol,
        data.sinopsis,
        data.anio_lanzamiento,
        data.pais_origen,
        data.duracion_minutos,
        data.ficha_tecnica_resumen,
        data.id_director,
        data.id_tipo_cine,
      ]
    );

    return {
      success: true,
      id: result[0]?.insertId,
      message: "Película creada exitosamente",
    };
  } catch (error) {
    console.error("Error creating pelicula:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error al crear película",
    };
  }
}

// Crear horario de función (usa el trigger TR_AfterInsert_Horario)
export async function crearHorarioFuncion(data: {
  fecha_hora_transmision: string;
  id_pelicula: number;
}): Promise<{ success: boolean; id?: number; message: string }> {
  try {
    const result = await query<{ insertId: number }>(
      `INSERT INTO horario_funcion (fecha_hora_transmision, id_pelicula) 
       VALUES (?, ?)`,
      [data.fecha_hora_transmision, data.id_pelicula]
    );

    return {
      success: true,
      id: result[0]?.insertId,
      message: "Horario creado exitosamente. Se registró en log_cartelera.",
    };
  } catch (error) {
    console.error("Error creating horario:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error al crear horario",
    };
  }
}

// Actualizar película (usa el SP_ActualizarSinopsis para la sinopsis)
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
  try {
    const fields: string[] = [];
    const values: any[] = [];

    Object.entries(data).forEach(([key, value]) => {
      fields.push(`${key} = ?`);
      values.push(value);
    });

    if (fields.length === 0) {
      return { success: false, message: "No hay campos para actualizar" };
    }

    values.push(id);

    await query(
      `UPDATE pelicula SET ${fields.join(", ")} WHERE id_pelicula = ?`,
      values
    );

    return {
      success: true,
      message: "Película actualizada exitosamente",
    };
  } catch (error) {
    console.error("Error updating pelicula:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error al actualizar película",
    };
  }
}

// Actualizar sinopsis usando el Stored Procedure
export async function actualizarSinopsisSP(
  id_pelicula: number,
  nueva_sinopsis: string
): Promise<{ success: boolean; message: string }> {
  try {
    await query(
      "CALL SP_ActualizarSinopsis(?, ?)",
      [id_pelicula, nueva_sinopsis]
    );

    return {
      success: true,
      message: `Sinopsis de la película ID ${id_pelicula} actualizada correctamente mediante SP`,
    };
  } catch (error) {
    console.error("Error updating sinopsis:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error al actualizar sinopsis",
    };
  }
}

// Búsqueda de películas por título
export async function buscarPeliculas(busqueda: string): Promise<Pelicula[]> {
  try {
    return await query<Pelicula>(
      `SELECT 
        p.*,
        d.nombre_completo as director_nombre,
        tc.nombre_tipo as tipo_cine_nombre
      FROM pelicula p
      LEFT JOIN director d ON p.id_director = d.id_director
      LEFT JOIN tipo_cine tc ON p.id_tipo_cine = tc.id_tipo
      WHERE p.titulo_original LIKE ? 
         OR p.titulo_espanol LIKE ?
      ORDER BY p.titulo_espanol ASC, p.titulo_original ASC
      LIMIT 20`,
      [`%${busqueda}%`, `%${busqueda}%`]
    );
  } catch (error) {
    console.error("Error searching peliculas:", error);
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
