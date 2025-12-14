USE cinema22_db;
-- 8
 DELIMITER $$
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
-- Ejecución para obtener las películas de 'Cine de Autor'
CALL SP_ConsultarCarteleraPorTipo('Cine de Autor');

DELIMITER $$
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
-- Ejecución para contar películas de 'Alfred Hitchcock'
CALL SP_ContarPeliculasPorDirector('Alfred Hitchcock', @TotalHitchcock);
SELECT @TotalHitchcock AS Total_Peliculas_Hitchcock;

DELIMITER $$
CREATE PROCEDURE SP_ActualizarSinopsis(
    IN p_id_pelicula INT,
    IN p_nueva_sinopsis TEXT
)
BEGIN
    UPDATE pelicula
    SET sinopsis = p_nueva_sinopsis
    WHERE id_pelicula = p_id_pelicula;
    
    SELECT CONCAT('Sinopsis de la película ID ', p_id_pelicula, ' actualizada correctamente.') AS Mensaje;
END$$
DELIMITER ;
-- Ejecución para actualizar la sinopsis de la película ID 1 ('Roma')
CALL SP_ActualizarSinopsis(1, 'La aclamada crónica de un año turbulento en la vida de una familia de clase media en la CDMX, con una nueva sinopsis editada.');
-- 9 
CREATE VIEW VW_CarteleraSemanal AS
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
SELECT * FROM VW_CarteleraSemanal LIMIT 5; 
-- Muestra las primeras 5 funciones programadas con todos los detalles.

CREATE VIEW VW_Capsulas_Asociadas AS
SELECT
    c.titulo_capsula AS Título_Cápsula,
    p.titulo_espanol AS Película_Relacionada,
    c.fecha_transmision AS Fecha_Transmisión,
    c.duracion_minutos AS Duración_Min
FROM
    cine_capsula c
JOIN
    pelicula p ON c.id_pelicula = p.id_pelicula
WHERE
    c.id_pelicula IS NOT NULL;
SELECT * FROM VW_Capsulas_Asociadas LIMIT 5; 
-- Muestra las primeras 5 cápsulas que tienen una película vinculada.

CREATE VIEW VW_ResumenPeliculasCortas AS
SELECT
    p.titulo_espanol AS Título,
    p.duracion_minutos AS Duración_Minutos,
    tc.nombre_tipo AS Clasificación
FROM
    pelicula p
JOIN
    tipo_cine tc ON p.id_tipo_cine = tc.id_tipo
WHERE
    p.duracion_minutos <= 100
ORDER BY
    p.duracion_minutos DESC;
SELECT * FROM VW_ResumenPeliculasCortas LIMIT 5;
-- Muestra las primeras 5 películas con duración menor o igual a 100 minutos.

-- 10
SELECT 
    tc.nombre_tipo AS Tipo_Cine,
    COUNT(p.id_pelicula) AS Total_Peliculas_en_Catálogo
FROM 
    tipo_cine tc
LEFT JOIN 
    pelicula p ON tc.id_tipo = p.id_tipo_cine
GROUP BY 
    tc.nombre_tipo
ORDER BY 
    Total_Peliculas_en_Catálogo DESC;
--     
SELECT
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
    Duracion_Promedio_Minutos DESC;
--    
SELECT 
    hf.fecha_hora_transmision AS Horario,
    p.titulo_espanol AS Título_Película,
    d.nombre_completo AS Director,
    tc.nombre_tipo AS Tipo_Cine
FROM 
    horario_funcion hf
JOIN 
    pelicula p ON hf.id_pelicula = p.id_pelicula
JOIN 
    director d ON p.id_director = d.id_director
JOIN 
    tipo_cine tc ON p.id_tipo_cine = tc.id_tipo
WHERE
    hf.fecha_hora_transmision >= '2025-12-20' -- Ejemplo: Películas a partir de una fecha
ORDER BY 
    hf.fecha_hora_transmision;
--   
SELECT
    p.titulo_espanol AS Película,
    tc.nombre_tipo AS Clasificación,
    p.ficha_tecnica_resumen AS Ficha_Técnica,
    c.titulo_capsula AS Cápsula_Relacionada
FROM
    pelicula p
JOIN
    tipo_cine tc ON p.id_tipo_cine = tc.id_tipo
LEFT JOIN 
    cine_capsula c ON p.id_pelicula = c.id_pelicula
WHERE
    tc.nombre_tipo IN ('Cine Mexicano Clásico', 'Ciclo de Cine Negro');
--
SELECT
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
    d.nombre_completo, hf.fecha_hora_transmision;
--
-- 12
DELIMITER $$
CREATE TRIGGER TR_BeforeInsert_Pelicula_Duracion
BEFORE INSERT ON pelicula
FOR EACH ROW
BEGIN
    IF NEW.duracion_minutos <= 0 OR NEW.duracion_minutos IS NULL THEN
        SET NEW.duracion_minutos = 1;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Advertencia: La duración de la película fue inválida (<= 0 o NULL) y se ha establecido a 1 minuto por defecto.';
    END IF;
END$$
DELIMITER ;
-- Sentencia que dispara el Trigger
INSERT INTO pelicula (titulo_original, anio_lanzamiento, pais_origen, duracion_minutos, id_director, id_tipo_cine) 
VALUES ('Test Duracion Invalida', 2024, 'MX', 0, 1, 1);

-- Resultado:
-- El registro se inserta con duracion_minutos = 1, y el gestor de BD debe mostrar el mensaje de advertencia.

CREATE TABLE IF NOT EXISTS log_cartelera (
    id_log INT AUTO_INCREMENT PRIMARY KEY,
    id_horario_afectado INT,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    descripcion_accion VARCHAR(255)
);
DELIMITER $$
CREATE TRIGGER TR_AfterInsert_Horario
AFTER INSERT ON horario_funcion
FOR EACH ROW
BEGIN
    INSERT INTO log_cartelera (id_horario_afectado, descripcion_accion)
    VALUES (NEW.id_horario, CONCAT('Nueva función insertada para la película ID ', NEW.id_pelicula, ' el ', DATE_FORMAT(NEW.fecha_hora_transmision, '%Y-%m-%d %H:%i')));
END$$
DELIMITER ;
-- Sentencia que dispara el Trigger (se inserta una nueva función para la Película ID 1)
INSERT INTO horario_funcion (fecha_hora_transmision, id_pelicula) 
VALUES ('2026-01-01 15:00:00', 1);

-- Verificación del Log:
SELECT * FROM log_cartelera ORDER BY id_log DESC LIMIT 1;

-- Resultado:
-- Se encontrará un nuevo registro en log_cartelera:
-- id_log: 1 (o el siguiente ID)
-- id_horario_afectado: [ID del nuevo horario]
-- fecha_modificacion: [Fecha y hora actual]
-- descripcion_accion: "Nueva función insertada para la película ID 1 el 2026-01-01 15:00"