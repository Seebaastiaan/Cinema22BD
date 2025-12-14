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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  getCarteleraPorTipo,
  getDuracionPromedioPorPais,
  getFuncionesProximas,
  getPeliculasPorDirector,
  getPeliculasPorDirectorEspecifico,
  getPeliculasPorTipoCine,
} from "@/lib/actions";
import { formatDate } from "@/lib/utils";
import { Calendar, Code, Globe, Play, Search, TrendingUp, Users } from "lucide-react";
import { useState } from "react";

interface QueryResult {
  [key: string]: unknown;
}

export function ConsultasEspeciales() {
  const [activeQuery, setActiveQuery] = useState<string | null>(null);
  const [results, setResults] = useState<QueryResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeQuery = async (
    queryName: string,
    queryFn: () => Promise<QueryResult[]>
  ) => {
    setLoading(true);
    setError(null);
    setActiveQuery(queryName);

    try {
      const data = await queryFn();
      setResults(data);
    } catch (err) {
      setError("Error al ejecutar la consulta");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const queries = [
    // -- 8: Stored Procedures
    {
      id: "sp-cartelera-tipo",
      title: "SP: Cartelera por Tipo",
      description:
        "Stored Procedure para consultar películas por tipo de cine",
      icon: Search,
      color: "from-purple-500 to-purple-700",
      sql: `DELIMITER $$
CREATE PROCEDURE SP_ConsultarCarteleraPorTipo(
    IN p_nombre_tipo VARCHAR(50)
)
BEGIN
    SELECT 
        tc.nombre_tipo AS Tipo_Cine,
        p.titulo_espanol AS Título_Película,
        d.nombre_completo AS Director,
        hf.fecha_hora_transmision AS Horario
    FROM 
        pelicula p
    JOIN 
        tipo_cine tc ON p.id_tipo_cine = tc.id_tipo
    JOIN 
        director d ON p.id_director = d.id_director
    JOIN 
        horario_funcion hf ON p.id_pelicula = hf.id_pelicula
    WHERE 
        tc.nombre_tipo = p_nombre_tipo
    ORDER BY 
        hf.fecha_hora_transmision;
END$$
DELIMITER ;

-- Ejecución:
CALL SP_ConsultarCarteleraPorTipo('Cine de Autor');`,
      execute: () =>
        executeQuery("cartelera-autor", () =>
          getCarteleraPorTipo("Cine de Autor")
        ),
    },
    {
      id: "sp-contar-director",
      title: "SP: Contador por Director",
      description: "Stored Procedure con parámetro OUT",
      icon: Play,
      color: "from-indigo-500 to-indigo-700",
      sql: `DELIMITER $$
CREATE PROCEDURE SP_ContarPeliculasPorDirector(
    IN p_nombre_director VARCHAR(100),
    OUT p_total_peliculas INT
)
BEGIN
    SELECT 
        COUNT(p.id_pelicula) INTO p_total_peliculas
    FROM 
        pelicula p
    JOIN 
        director d ON p.id_director = d.id_director
    WHERE 
        d.nombre_completo = p_nombre_director;
END$$
DELIMITER ;

-- Ejecución:
CALL SP_ContarPeliculasPorDirector('Alfred Hitchcock', @TotalHitchcock);
SELECT @TotalHitchcock AS Total_Peliculas_Hitchcock;`,
      execute: () =>
        executeQuery("hitchcock-count", () =>
          getPeliculasPorDirector("Alfred Hitchcock")
        ),
    },
    // -- 9: Views
    {
      id: "view-cartelera",
      title: "VIEW: Cartelera Semanal",
      description: "Vista que muestra la cartelera completa ordenada",
      icon: Calendar,
      color: "from-orange-500 to-orange-700",
      sql: `CREATE VIEW VW_CarteleraSemanal AS
SELECT
    hf.fecha_hora_transmision AS Horario,
    p.titulo_espanol AS Título,
    d.nombre_completo AS Director,
    tc.nombre_tipo AS Tipo_Cine,
    p.duracion_minutos AS Duración_Min
FROM
    horario_funcion hf
JOIN
    pelicula p ON hf.id_pelicula = p.id_pelicula
JOIN
    director d ON p.id_director = d.id_director
JOIN
    tipo_cine tc ON p.id_tipo_cine = tc.id_tipo
ORDER BY
    hf.fecha_hora_transmision;

-- Consulta de la vista (primeras 10):
SELECT * FROM VW_CarteleraSemanal 
WHERE Horario >= NOW() 
LIMIT 10;`,
      execute: () => executeQuery("funciones-proximas", getFuncionesProximas),
    },
    // -- 10: Consultas con GROUP BY, HAVING, JOINs
    {
      id: "query-peliculas-tipo",
      title: "Películas por Tipo de Cine",
      description: "Consulta con GROUP BY y LEFT JOIN",
      icon: TrendingUp,
      color: "from-blue-500 to-blue-700",
      sql: `SELECT 
    tc.nombre_tipo AS Tipo_Cine,
    COUNT(p.id_pelicula) AS Total_Peliculas_en_Catálogo
FROM 
    tipo_cine tc
LEFT JOIN 
    pelicula p ON tc.id_tipo = p.id_tipo_cine
GROUP BY 
    tc.nombre_tipo
ORDER BY 
    Total_Peliculas_en_Catálogo DESC;`,
      execute: () => executeQuery("peliculas-tipo", getPeliculasPorTipoCine),
    },
    {
      id: "query-duracion-pais",
      title: "Duración Promedio por País",
      description: "Consulta con AVG, GROUP BY y HAVING",
      icon: Globe,
      color: "from-green-500 to-green-700",
      sql: `SELECT
    pais_origen AS País_de_Origen,
    AVG(duracion_minutos) AS Duracion_Promedio_Minutos,
    COUNT(id_pelicula) AS Número_de_Películas
FROM
    pelicula
GROUP BY
    pais_origen
HAVING
    COUNT(id_pelicula) >= 2 -- Mostrar solo países con al menos 2 películas
ORDER BY
    Duracion_Promedio_Minutos DESC;`,
      execute: () => executeQuery("duracion-pais", getDuracionPromedioPorPais),
    },
    {
      id: "query-directores-especificos",
      title: "Películas de Directores Específicos",
      description: "Consulta con IN para múltiples directores",
      icon: Users,
      color: "from-pink-500 to-pink-700",
      sql: `SELECT
    hf.fecha_hora_transmision AS Horario,
    p.titulo_espanol AS Título_Película,
    d.nombre_completo AS Director,
    p.duracion_minutos AS Duración_Minutos
FROM
    horario_funcion hf
JOIN
    pelicula p ON hf.id_pelicula = p.id_pelicula
JOIN
    director d ON p.id_director = d.id_director
WHERE
    d.nombre_completo IN ('Akira Kurosawa', 'Guillermo del Toro')
ORDER BY
    d.nombre_completo, hf.fecha_hora_transmision;`,
      execute: () =>
        executeQuery("directores-especificos", () =>
          getPeliculasPorDirectorEspecifico([
            "Akira Kurosawa",
            "Guillermo del Toro",
          ])
        ),
    },
  ];

  const renderResults = () => {
    if (loading) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Ejecutando consulta...
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12 text-red-600">
          <p className="font-semibold">{error}</p>
        </div>
      );
    }

    if (results.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>Selecciona una consulta para ver los resultados</p>
        </div>
      );
    }

    // Renderizar resultados según el tipo de consulta
    const keys = Object.keys(results[0]);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">
            Resultados ({results.length})
          </h3>
          <Badge variant="outline" className="text-sm">
            {keys.length} columnas
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-linear-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
                {keys.map((key) => (
                  <th
                    key={key}
                    className="px-4 py-3 text-left text-sm font-semibold text-purple-900 dark:text-purple-100 border-b-2 border-purple-300 dark:border-purple-700"
                  >
                    {key.replace(/_/g, " ")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors border-b border-gray-200 dark:border-gray-700"
                >
                  {keys.map((key) => {
                    const value = row[key];
                    let displayValue: string;

                    if (key.toLowerCase().includes("horario") || key.toLowerCase().includes("fecha")) {
                      displayValue = typeof value === "string" ? formatDate(value) : "-";
                    } else if (typeof value === "number") {
                      displayValue = value.toLocaleString();
                    } else if (typeof value === "string") {
                      displayValue = value;
                    } else {
                      displayValue = "-";
                    }

                    return (
                      <td
                        key={key}
                        className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300"
                      >
                        {displayValue}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Consultas SQL Especiales
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Ejecuta consultas avanzadas sobre la base de datos
        </p>
      </div>

      {/* Query Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {queries.map((query) => {
          const Icon = query.icon;
          const isActive = activeQuery === query.id;

          return (
            <Card
              key={query.id}
              className={`border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                isActive
                  ? "border-purple-500 shadow-lg"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <CardHeader>
                <div
                  className={`inline-flex p-3 rounded-xl bg-linear-to-br ${query.color} text-white mb-3 w-fit`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">{query.title}</CardTitle>
                <CardDescription className="text-sm">
                  {query.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Acordeón con código SQL */}
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="sql-code" className="border-none">
                    <AccordionTrigger className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 py-2">
                      <div className="flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        <span>Ver código SQL</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="relative max-h-64 overflow-y-auto">
                        <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs leading-relaxed">
                          <code>{query.sql}</code>
                        </pre>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Botón ejecutar */}
                <Button
                  onClick={query.execute}
                  disabled={loading}
                  className={`w-full bg-linear-to-r ${query.color} hover:opacity-90 text-white font-semibold`}
                >
                  {loading && isActive ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Ejecutando...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Ejecutar Consulta
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Results Section */}
      {(results.length > 0 || loading || error) && (
        <Card className="border-2 border-purple-200 dark:border-purple-800 shadow-xl">
          <CardHeader className="bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
            <CardTitle className="text-2xl">
              Resultados de la Consulta
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">{renderResults()}</CardContent>
        </Card>
      )}
    </div>
  );
}
