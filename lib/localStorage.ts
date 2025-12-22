"use client";

import {
  INITIAL_CAPSULAS,
  INITIAL_DIRECTORES,
  INITIAL_HORARIOS,
  INITIAL_PELICULAS,
  INITIAL_TIPO_CINE,
} from "./initialData";
import type {
  CineCapsula,
  Director,
  HorarioFuncion,
  Pelicula,
  TipoCine,
} from "./types";

// Claves para localStorage
const STORAGE_KEYS = {
  TIPO_CINE: "cinema22_tipo_cine",
  DIRECTORES: "cinema22_directores",
  PELICULAS: "cinema22_peliculas",
  HORARIOS: "cinema22_horarios",
  CAPSULAS: "cinema22_capsulas",
  INITIALIZED: "cinema22_initialized",
};

// Función para verificar si estamos en el cliente
const isClient = typeof window !== "undefined";

// Inicializar datos si no existen
export function initializeLocalStorage() {
  if (!isClient) return;

  const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);

  if (!initialized) {
    localStorage.setItem(
      STORAGE_KEYS.TIPO_CINE,
      JSON.stringify(INITIAL_TIPO_CINE)
    );
    localStorage.setItem(
      STORAGE_KEYS.DIRECTORES,
      JSON.stringify(INITIAL_DIRECTORES)
    );
    localStorage.setItem(
      STORAGE_KEYS.PELICULAS,
      JSON.stringify(INITIAL_PELICULAS)
    );
    localStorage.setItem(
      STORAGE_KEYS.HORARIOS,
      JSON.stringify(INITIAL_HORARIOS)
    );
    localStorage.setItem(
      STORAGE_KEYS.CAPSULAS,
      JSON.stringify(INITIAL_CAPSULAS)
    );
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, "true");
  }
}

// Funciones auxiliares para obtener datos con relaciones
function enrichPeliculaWithRelations(pelicula: Pelicula): Pelicula {
  if (!isClient) return pelicula;

  const directores = getDirectores();
  const tiposCine = getTiposCine();

  const director = directores.find(
    (d) => d.id_director === pelicula.id_director
  );
  const tipoCine = tiposCine.find((t) => t.id_tipo === pelicula.id_tipo_cine);

  return {
    ...pelicula,
    director_nombre: director?.nombre_completo,
    tipo_cine_nombre: tipoCine?.nombre_tipo,
  };
}

// ========== TIPO CINE ==========
export function getTiposCine(): TipoCine[] {
  if (!isClient) return [];
  const data = localStorage.getItem(STORAGE_KEYS.TIPO_CINE);
  return data ? JSON.parse(data) : [];
}

// ========== DIRECTORES ==========
export function getDirectores(): Director[] {
  if (!isClient) return [];
  const data = localStorage.getItem(STORAGE_KEYS.DIRECTORES);
  return data ? JSON.parse(data) : [];
}

// ========== PELÍCULAS ==========
export function getPeliculas(): Pelicula[] {
  if (!isClient) return [];
  const data = localStorage.getItem(STORAGE_KEYS.PELICULAS);
  const peliculas: Pelicula[] = data ? JSON.parse(data) : [];
  return peliculas.map(enrichPeliculaWithRelations);
}

export function getPeliculaById(id: number): Pelicula | null {
  if (!isClient) return null;
  const peliculas = getPeliculas();
  return peliculas.find((p) => p.id_pelicula === id) || null;
}

export function buscarPeliculas(busqueda: string): Pelicula[] {
  if (!isClient) return [];
  const peliculas = getPeliculas();
  const termino = busqueda.toLowerCase();

  return peliculas
    .filter(
      (p) =>
        p.titulo_original.toLowerCase().includes(termino) ||
        p.titulo_espanol?.toLowerCase().includes(termino)
    )
    .slice(0, 20);
}

export function crearPelicula(data: {
  titulo_original: string;
  titulo_espanol: string | null;
  sinopsis: string | null;
  anio_lanzamiento: number;
  pais_origen: string | null;
  duracion_minutos: number | null;
  ficha_tecnica_resumen: string | null;
  id_director: number | null;
  id_tipo_cine: number | null;
}): { success: boolean; id?: number; message: string } {
  if (!isClient) {
    return { success: false, message: "No disponible en el servidor" };
  }

  try {
    const peliculas = getPeliculas();

    // Simular trigger: validar duración
    let duracion = data.duracion_minutos;
    if (!duracion || duracion <= 0) {
      duracion = 1;
    }

    const maxId = peliculas.reduce((max, p) => Math.max(max, p.id_pelicula), 0);
    const nuevaPelicula: Pelicula = {
      id_pelicula: maxId + 1,
      titulo_original: data.titulo_original,
      titulo_espanol: data.titulo_espanol,
      sinopsis: data.sinopsis,
      anio_lanzamiento: data.anio_lanzamiento,
      pais_origen: data.pais_origen,
      duracion_minutos: duracion,
      ficha_tecnica_resumen: data.ficha_tecnica_resumen,
      id_director: data.id_director,
      id_tipo_cine: data.id_tipo_cine,
    };

    peliculas.push(nuevaPelicula);
    localStorage.setItem(STORAGE_KEYS.PELICULAS, JSON.stringify(peliculas));

    return {
      success: true,
      id: nuevaPelicula.id_pelicula,
      message: "Película creada exitosamente",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Error al crear película",
    };
  }
}

export function actualizarPelicula(
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
): { success: boolean; message: string } {
  if (!isClient) {
    return { success: false, message: "No disponible en el servidor" };
  }

  try {
    const peliculasData = localStorage.getItem(STORAGE_KEYS.PELICULAS);
    const peliculas: Pelicula[] = peliculasData
      ? JSON.parse(peliculasData)
      : [];

    const index = peliculas.findIndex((p) => p.id_pelicula === id);
    if (index === -1) {
      return { success: false, message: "Película no encontrada" };
    }

    peliculas[index] = { ...peliculas[index], ...data };
    localStorage.setItem(STORAGE_KEYS.PELICULAS, JSON.stringify(peliculas));

    return {
      success: true,
      message: "Película actualizada exitosamente",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Error al actualizar película",
    };
  }
}

// ========== HORARIOS ==========
export function getHorariosFunciones(): (HorarioFuncion & {
  titulo_original: string;
  titulo_espanol: string | null | undefined;
  duracion_minutos?: number;
})[] {
  if (!isClient) return [];

  const horariosData = localStorage.getItem(STORAGE_KEYS.HORARIOS);
  const horarios: HorarioFuncion[] = horariosData
    ? JSON.parse(horariosData)
    : [];
  const peliculas = getPeliculas();

  const result: (HorarioFuncion & {
    titulo_original: string;
    titulo_espanol: string | null | undefined;
    duracion_minutos?: number;
  })[] = [];

  for (const h of horarios) {
    const pelicula = peliculas.find((p) => p.id_pelicula === h.id_pelicula);
    if (pelicula) {
      result.push({
        ...h,
        titulo_original: pelicula.titulo_original,
        titulo_espanol: pelicula.titulo_espanol ?? undefined,
        duracion_minutos: pelicula.duracion_minutos || undefined,
      });
    }
  }

  return result
    .sort(
      (a, b) =>
        new Date(b.fecha_hora_transmision).getTime() -
        new Date(a.fecha_hora_transmision).getTime()
    )
    .slice(0, 50);
}

export function getHorariosByPelicula(idPelicula: number): HorarioFuncion[] {
  if (!isClient) return [];

  const horariosData = localStorage.getItem(STORAGE_KEYS.HORARIOS);
  const horarios: HorarioFuncion[] = horariosData
    ? JSON.parse(horariosData)
    : [];

  return horarios
    .filter((h) => h.id_pelicula === idPelicula)
    .sort(
      (a, b) =>
        new Date(a.fecha_hora_transmision).getTime() -
        new Date(b.fecha_hora_transmision).getTime()
    );
}

export function crearHorarioFuncion(data: {
  fecha_hora_transmision: string;
  id_pelicula: number;
}): { success: boolean; id?: number; message: string } {
  if (!isClient) {
    return { success: false, message: "No disponible en el servidor" };
  }

  try {
    const horariosData = localStorage.getItem(STORAGE_KEYS.HORARIOS);
    const horarios: HorarioFuncion[] = horariosData
      ? JSON.parse(horariosData)
      : [];

    const maxId = horarios.reduce((max, h) => Math.max(max, h.id_horario), 0);
    const nuevoHorario: HorarioFuncion = {
      id_horario: maxId + 1,
      fecha_hora_transmision: data.fecha_hora_transmision,
      id_pelicula: data.id_pelicula,
    };

    horarios.push(nuevoHorario);
    localStorage.setItem(STORAGE_KEYS.HORARIOS, JSON.stringify(horarios));

    return {
      success: true,
      id: nuevoHorario.id_horario,
      message: "Horario creado exitosamente",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Error al crear horario",
    };
  }
}

// ========== CÁPSULAS ==========
export function getCineCapsulas(): (CineCapsula & {
  pelicula_titulo?: string;
})[] {
  if (!isClient) return [];

  const capsulasData = localStorage.getItem(STORAGE_KEYS.CAPSULAS);
  const capsulas: CineCapsula[] = capsulasData ? JSON.parse(capsulasData) : [];
  const peliculas = getPeliculas();

  return capsulas
    .map((c) => {
      if (c.id_pelicula) {
        const pelicula = peliculas.find((p) => p.id_pelicula === c.id_pelicula);
        return {
          ...c,
          pelicula_titulo: pelicula?.titulo_original,
        };
      }
      return c;
    })
    .sort((a, b) => {
      const dateA = a.fecha_transmision
        ? new Date(a.fecha_transmision).getTime()
        : 0;
      const dateB = b.fecha_transmision
        ? new Date(b.fecha_transmision).getTime()
        : 0;
      return dateB - dateA;
    });
}

export function getCapsulasByPelicula(idPelicula: number): CineCapsula[] {
  if (!isClient) return [];

  const capsulasData = localStorage.getItem(STORAGE_KEYS.CAPSULAS);
  const capsulas: CineCapsula[] = capsulasData ? JSON.parse(capsulasData) : [];

  return capsulas
    .filter((c) => c.id_pelicula === idPelicula)
    .sort((a, b) => {
      const dateA = a.fecha_transmision
        ? new Date(a.fecha_transmision).getTime()
        : 0;
      const dateB = b.fecha_transmision
        ? new Date(b.fecha_transmision).getTime()
        : 0;
      return dateA - dateB;
    });
}

// ========== DASHBOARD STATS ==========
export function getDashboardStats() {
  if (!isClient) {
    return {
      totalPeliculas: 0,
      totalFunciones: 0,
      totalCapsulas: 0,
      totalDirectores: 0,
    };
  }

  const peliculas = getPeliculas();
  const horarios = getHorariosFunciones();
  const capsulas = getCineCapsulas();
  const directores = getDirectores();

  const now = new Date();
  const proximaFuncion = horarios
    .filter((h) => new Date(h.fecha_hora_transmision) > now)
    .sort(
      (a, b) =>
        new Date(a.fecha_hora_transmision).getTime() -
        new Date(b.fecha_hora_transmision).getTime()
    )[0];

  return {
    totalPeliculas: peliculas.length,
    totalFunciones: horarios.length,
    totalCapsulas: capsulas.length,
    totalDirectores: directores.length,
    proximaFuncion: proximaFuncion || undefined,
  };
}

// ========== CONSULTAS ESPECIALES ==========

export function getCarteleraPorTipo(nombreTipo: string) {
  if (!isClient) return [];

  const peliculas = getPeliculas();
  const horarios = getHorariosFunciones();
  const tiposCine = getTiposCine();
  const directores = getDirectores();

  const tipo = tiposCine.find((t) => t.nombre_tipo === nombreTipo);
  if (!tipo) return [];

  const peliculasFiltradas = peliculas.filter(
    (p) => p.id_tipo_cine === tipo.id_tipo
  );

  const result = horarios
    .filter((h) =>
      peliculasFiltradas.some((p) => p.id_pelicula === h.id_pelicula)
    )
    .map((h) => {
      const pelicula = peliculasFiltradas.find(
        (p) => p.id_pelicula === h.id_pelicula
      );
      const director = directores.find(
        (d) => d.id_director === pelicula?.id_director
      );

      return {
        Tipo_Cine: nombreTipo,
        Titulo_Pelicula:
          pelicula?.titulo_espanol || pelicula?.titulo_original || "",
        Director: director?.nombre_completo || "",
        Horario: h.fecha_hora_transmision,
      };
    })
    .sort(
      (a, b) => new Date(a.Horario).getTime() - new Date(b.Horario).getTime()
    );

  return result;
}

export function getPeliculasPorDirector(nombreDirector: string) {
  if (!isClient) return [{ total: 0 }];

  const peliculas = getPeliculas();
  const directores = getDirectores();

  const director = directores.find((d) => d.nombre_completo === nombreDirector);
  if (!director) return [{ total: 0 }];

  const total = peliculas.filter(
    (p) => p.id_director === director.id_director
  ).length;

  return [{ total }];
}

export function getPeliculasPorTipoCine() {
  if (!isClient) return [];

  const peliculas = getPeliculas();
  const tiposCine = getTiposCine();

  return tiposCine
    .map((tipo) => {
      const total = peliculas.filter(
        (p) => p.id_tipo_cine === tipo.id_tipo
      ).length;
      return {
        Tipo_Cine: tipo.nombre_tipo,
        Total_Peliculas: total,
      };
    })
    .sort((a, b) => b.Total_Peliculas - a.Total_Peliculas);
}

export function getDuracionPromedioPorPais() {
  if (!isClient) return [];

  const peliculas = getPeliculas();

  const paises = new Map<string, { total: number; count: number }>();

  peliculas.forEach((p) => {
    if (p.pais_origen && p.duracion_minutos) {
      const current = paises.get(p.pais_origen) || { total: 0, count: 0 };
      paises.set(p.pais_origen, {
        total: current.total + p.duracion_minutos,
        count: current.count + 1,
      });
    }
  });

  const result = Array.from(paises.entries())
    .filter(([, data]) => data.count >= 2)
    .map(([pais, data]) => ({
      Pais_Origen: pais,
      Duracion_Promedio: data.total / data.count,
      Numero_Peliculas: data.count,
    }))
    .sort((a, b) => b.Duracion_Promedio - a.Duracion_Promedio);

  return result;
}

export function getFuncionesProximas() {
  if (!isClient) return [];

  const horarios = getHorariosFunciones();
  const peliculas = getPeliculas();
  const directores = getDirectores();
  const tiposCine = getTiposCine();

  const now = new Date();

  return horarios
    .filter((h) => new Date(h.fecha_hora_transmision) >= now)
    .map((h) => {
      const pelicula = peliculas.find((p) => p.id_pelicula === h.id_pelicula);
      const director = directores.find(
        (d) => d.id_director === pelicula?.id_director
      );
      const tipo = tiposCine.find((t) => t.id_tipo === pelicula?.id_tipo_cine);

      return {
        Horario: h.fecha_hora_transmision,
        Titulo_Pelicula:
          pelicula?.titulo_espanol || pelicula?.titulo_original || "",
        Director: director?.nombre_completo || "",
        Tipo_Cine: tipo?.nombre_tipo || "",
      };
    })
    .sort(
      (a, b) => new Date(a.Horario).getTime() - new Date(b.Horario).getTime()
    )
    .slice(0, 10);
}

export function getPeliculasPorDirectorEspecifico(directores: string[]) {
  if (!isClient) return [];

  const peliculas = getPeliculas();
  const horarios = getHorariosFunciones();
  const directoresList = getDirectores();

  const directoresIds = directoresList
    .filter((d) => directores.includes(d.nombre_completo))
    .map((d) => d.id_director);

  const peliculasFiltradas = peliculas.filter(
    (p) => p.id_director && directoresIds.includes(p.id_director)
  );

  return horarios
    .filter((h) =>
      peliculasFiltradas.some((p) => p.id_pelicula === h.id_pelicula)
    )
    .map((h) => {
      const pelicula = peliculasFiltradas.find(
        (p) => p.id_pelicula === h.id_pelicula
      );
      const director = directoresList.find(
        (d) => d.id_director === pelicula?.id_director
      );

      return {
        Horario: h.fecha_hora_transmision,
        Titulo_Pelicula:
          pelicula?.titulo_espanol || pelicula?.titulo_original || "",
        Director: director?.nombre_completo || "",
        Duracion_Minutos: pelicula?.duracion_minutos || 0,
      };
    })
    .sort((a, b) => {
      const dirComp = a.Director.localeCompare(b.Director);
      if (dirComp !== 0) return dirComp;
      return new Date(a.Horario).getTime() - new Date(b.Horario).getTime();
    });
}

// Función para simular el Stored Procedure de actualización de sinopsis
export function actualizarSinopsisSP(
  id_pelicula: number,
  nueva_sinopsis: string
): { success: boolean; message: string } {
  return actualizarPelicula(id_pelicula, { sinopsis: nueva_sinopsis });
}
