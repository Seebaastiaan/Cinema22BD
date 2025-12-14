export interface TipoCine {
  id_tipo: number;
  nombre_tipo: string;
}

export interface Director {
  id_director: number;
  nombre_completo: string;
}

export interface Pelicula {
  id_pelicula: number;
  titulo_original: string;
  titulo_espanol: string | null;
  sinopsis: string | null;
  anio_lanzamiento: number;
  pais_origen: string | null;
  duracion_minutos: number | null;
  ficha_tecnica_resumen: string | null;
  id_director: number | null;
  id_tipo_cine: number | null;
  director_nombre?: string;
  tipo_cine_nombre?: string;
}

export interface HorarioFuncion {
  id_horario: number;
  fecha_hora_transmision: string;
  id_pelicula: number;
  titulo_original?: string;
  titulo_espanol?: string;
  duracion_minutos?: number;
}

export interface CineCapsula {
  id_capsula: number;
  titulo_capsula: string;
  descripcion: string | null;
  duracion_minutos: number | null;
  fecha_transmision: string | null;
  id_pelicula: number | null;
  pelicula_titulo?: string;
}

export interface DashboardStats {
  totalPeliculas: number;
  totalFunciones: number;
  totalCapsulas: number;
  totalDirectores: number;
  proximaFuncion?: HorarioFuncion & { titulo_original: string };
}

// Tipos para consultas especiales
export interface CarteleraPorTipo {
  [key: string]: unknown;
  Tipo_Cine: string;
  Titulo_Pelicula: string;
  Director: string;
  Horario: string;
}

export interface PeliculasPorDirectorCount {
  [key: string]: unknown;
  total: number;
}

export interface PeliculasPorTipoCine {
  [key: string]: unknown;
  Tipo_Cine: string;
  Total_Peliculas: number;
}

export interface DuracionPromedioPorPais {
  [key: string]: unknown;
  Pais_Origen: string;
  Duracion_Promedio: number;
  Numero_Peliculas: number;
}

export interface FuncionProxima {
  [key: string]: unknown;
  Horario: string;
  Titulo_Pelicula: string;
  Director: string;
  Tipo_Cine: string;
}

export interface PeliculaPorDirectorEspecifico {
  [key: string]: unknown;
  Horario: string;
  Titulo_Pelicula: string;
  Director: string;
  Duracion_Minutos: number;
}
