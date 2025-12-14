-- 1. Eliminación y Creación de la Base de Datos
-- Esto asegura que empezamos desde cero en caso de que ya existiera.
DROP DATABASE IF EXISTS cinema22_db;
CREATE DATABASE cinema22_db;
USE cinema22_db;

-- 2. Creación de Tablas de Catálogo

-- Tabla: tipo_cine (Clasificaciones como 'Cine de Autor', 'Cine de culto')
CREATE TABLE tipo_cine (
    id_tipo INT AUTO_INCREMENT PRIMARY KEY,
    nombre_tipo VARCHAR(50) NOT NULL UNIQUE
);

-- Tabla: director
CREATE TABLE director (
    id_director INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL
);

-- 3. Creación de la Tabla Central (pelicula)

CREATE TABLE pelicula (
    id_pelicula INT AUTO_INCREMENT PRIMARY KEY,
    titulo_original VARCHAR(150) NOT NULL,
    titulo_espanol VARCHAR(150),
    sinopsis TEXT,
    anio_lanzamiento YEAR NOT NULL,
    pais_origen VARCHAR(50),
    duracion_minutos INT CHECK (duracion_minutos > 0),
    ficha_tecnica_resumen TEXT COMMENT 'Resumen de actores clave, musica, fotografia',
    
    -- Llaves Foráneas
    id_director INT,
    id_tipo_cine INT,
    
    FOREIGN KEY (id_director) REFERENCES director(id_director) ON DELETE SET NULL,
    FOREIGN KEY (id_tipo_cine) REFERENCES tipo_cine(id_tipo) ON DELETE SET NULL
);

-- 4. Creación de Tablas de Relación y Contenido Adicional

-- Tabla: horario_funcion (Cartelera)
-- Relaciona una fecha/hora con una película.
CREATE TABLE horario_funcion (
    id_horario INT AUTO_INCREMENT PRIMARY KEY,
    fecha_hora_transmision DATETIME NOT NULL,
    
    -- Llave Foránea a pelicula
    id_pelicula INT NOT NULL,
    FOREIGN KEY (id_pelicula) REFERENCES pelicula(id_pelicula) ON DELETE CASCADE
);

-- Tabla: cine_capsula (Material extra relacionado con una película)
-- Incluye la modificación solicitada para vincularla a 'pelicula'.
CREATE TABLE cine_capsula (
    id_capsula INT AUTO_INCREMENT PRIMARY KEY,
    titulo_capsula VARCHAR(100) NOT NULL,
    descripcion TEXT,
    duracion_minutos INT,
    fecha_transmision DATETIME,
    
    -- Llave Foránea a pelicula (Permite NULL si es una cápsula genérica)
    id_pelicula INT,
    FOREIGN KEY (id_pelicula) REFERENCES pelicula(id_pelicula) ON DELETE SET NULL
);

-- poblar base de datos

INSERT INTO tipo_cine (nombre_tipo) VALUES
('Cine de Autor'),
('Cine de Culto'),
('5 Estrellas'),
('Documental'),
('Cine Mexicano Clásico'),
('Ciclo de Cine Negro'),
('Retrospectiva'),
('Animación Experimental');

INSERT INTO director (nombre_completo) VALUES
('Pedro Almodóvar'),
('Akira Kurosawa'),
('Guillermo del Toro'),
('Alfred Hitchcock'),
('Stanley Kubrick'),
('Sofía Coppola'),
('Ingmar Bergman'),
('Luis Buñuel'),
('Denis Villeneuve'),
('Agnès Varda'),
('Quentin Tarantino'),
('Alfonso Cuarón');

INSERT INTO pelicula (titulo_original, titulo_espanol, sinopsis, anio_lanzamiento, pais_origen, duracion_minutos, ficha_tecnica_resumen, id_director, id_tipo_cine) VALUES
-- Películas clave de ejemplo
('Roma', 'Roma', 'Crónica de un año turbulento en la vida de una familia de clase media en la Ciudad de México de principios de los 70.', 2018, 'México', 135, 'Fotografía en blanco y negro, Yalitza Aparicio, Marina de Tavira.', 12, 1),
('Yojimbo', 'Yojimbo, el mercenario', 'Un samurái errante llega a un pueblo dividido por dos bandas criminales y decide enfrentar a ambas.', 1961, 'Japón', 110, 'Toshiro Mifune en un papel icónico, influencia en el western spaghetti.', 2, 6),
('2001: A Space Odyssey', '2001: Odisea del Espacio', 'La evolución humana y la inteligencia artificial en un viaje a Júpiter.', 1968, 'Reino Unido/EE. UU.', 149, 'Efectos visuales revolucionarios, banda sonora clásica.', 5, 2),
('El laberinto del fauno', 'El laberinto del fauno', 'Una niña se adentra en un mundo mágico para escapar de la crueldad de la posguerra española.', 2006, 'México/España', 118, 'Fantasía oscura, diseño de criaturas.', 3, 3),
('Vertigo', 'Vértigo', 'Un detective retirado con miedo a las alturas investiga la obsesión de un amigo por su esposa.', 1958, 'EE. UU.', 128, 'Técnica de zoom in/dolly out, Kim Novak.', 4, 3),

-- Relleno para alcanzar 30 registros
('Pulp Fiction', 'Tiempos Violentos', 'Historias cruzadas de gánsteres, un boxeador, y ladrones de poca monta en Los Ángeles.', 1994, 'EE. UU.', 154, 'Diálogos ingeniosos, estructura narrativa no lineal.', 11, 2),
('El ángel exterminador', 'El ángel exterminador', 'Un grupo de burgueses se encuentra misteriosamente incapaz de salir de una habitación después de una cena.', 1962, 'México', 95, 'Sátira surrealista de la burguesía, crítica social.', 8, 1),
('The Piano', 'El Piano', 'Una mujer muda y su hija se trasladan a Nueva Zelanda para un matrimonio arreglado, llevando consigo solo su piano.', 1993, 'Nueva Zelanda', 121, 'Jane Campion, Holly Hunter, banda sonora memorable.', 6, 7),
('Persona', 'Persona', 'Una enfermera cuida a una actriz de teatro que ha enmudecido. Sus personalidades se mezclan.', 1966, 'Suecia', 85, 'Exploración psicológica profunda, planos intensos.', 7, 1),
('Oldboy', 'Oldboy', 'Un hombre es secuestrado y retenido durante 15 años sin saber la razón, y es liberado con un límite de tiempo para encontrar a su captor.', 2003, 'Corea del Sur', 120, 'Escena de lucha con martillo, trama de venganza.', 2, 2),
('The Lighthouse', 'El Faro', 'Dos fareros se enfrentan a la locura y los elementos en una remota isla de Nueva Inglaterra en la década de 1890.', 2019, 'EE. UU.', 109, 'Blanco y negro, formato de aspecto cuadrado.', 5, 4),
('Fargo', 'Fargo', 'Un vendedor de autos contrata a dos matones para secuestrar a su esposa, lo que desata una serie de asesinatos.', 1996, 'EE. UU.', 98, 'Hermanos Coen, humor negro, policía embarazada.', 11, 3),
('Hable con ella', 'Hable con ella', 'Dos hombres se conocen cuidando a dos mujeres en coma en un hospital.', 2002, 'España', 112, 'Temas de soledad y comunicación, música.', 1, 1),
('Trainspotting', 'Trainspotting', 'La vida de un grupo de jóvenes adictos a la heroína en Edimburgo.', 1996, 'Reino Unido', 94, 'Estilo visual frenético, Ewan McGregor.', 6, 2),
('Amélie', 'El fabuloso destino de Amélie Poulain', 'Una joven de París decide cambiar las vidas de las personas que la rodean para bien.', 2001, 'Francia', 122, 'Colores saturados, París idealizado.', 10, 3),
('La isla mínima', 'La isla mínima', 'Dos detectives de Madrid son enviados a un pueblo remoto para investigar la desaparición de dos adolescentes.', 2014, 'España', 105, 'Thriller oscuro, ambientación en los pantanos.', 9, 6),
('Parasite', 'Parásitos', 'Una familia pobre se infiltra en la vida de una familia rica con consecuencias inesperadas.', 2019, 'Corea del Sur', 132, 'Crítica social, cambio de género.', 3, 3),
('Midnight in Paris', 'Medianoche en París', 'Un escritor viaja en el tiempo a los años 20 en París.', 2011, 'EE. UU.', 94, 'Woody Allen, nostalgia.', 12, 7),
('Mad Max: Fury Road', 'Mad Max: Furia en el camino', 'En un futuro post-apocalíptico, una mujer lidera un grupo a través del desierto para escapar de un tirano.', 2015, 'Australia', 120, 'Acción continua, efectos prácticos.', 11, 2),
('Pans Labyrinth', 'El laberinto del fauno', 'Versión alternativa de El laberinto del Fauno.', 2006, 'México/España', 118, 'Fantasía y guerra.', 3, 3),
('The Godfather', 'El Padrino', 'La saga de la familia Corleone.', 1972, 'EE. UU.', 175, 'Obra maestra del cine de gánsteres.', 4, 3),
('Requiem for a Dream', 'Réquiem por un sueño', 'Cuatro vidas en Brooklyn se arruinan por adicciones.', 2000, 'EE. UU.', 102, 'Montaje rápido, impacto visual.', 6, 2),
('Babel', 'Babel', 'Historias interconectadas de personas de distintas culturas y países.', 2006, 'EE. UU.', 143, 'Narrativa coral, fotografía.', 12, 1),
('Drive', 'Drive', 'Un conductor de escape que trabaja en Hollywood se enamora de su vecina.', 2011, 'EE. UU.', 100, 'Estética neon, banda sonora ochentera.', 9, 2),
('Spirited Away', 'El viaje de Chihiro', 'Una niña se adentra en un mundo mágico de espíritus.', 2001, 'Japón', 125, 'Animación japonesa, Miyazaki.', 2, 8),
('Fanny y Alexander', 'Fanny y Alexander', 'Dos hermanos experimentan la vida a través de los ojos de la infancia en la Suecia de principios del siglo XX.', 1982, 'Suecia', 188, 'Drama familiar, Bergman.', 7, 1),
('Blue Velvet', 'Terciopelo Azul', 'Un joven descubre un lado oscuro de su tranquilo pueblo.', 1986, 'EE. UU.', 120, 'David Lynch, surrealismo.', 5, 2),
('Close-Up', 'Close-Up', 'Un hombre es juzgado por hacerse pasar por un director de cine.', 1990, 'Irán', 98, 'Documental/ficción, Abbas Kiarostami.', 10, 4),
('El discreto encanto de la burguesía', 'El discreto encanto de la burguesía', 'Un grupo de burgueses intenta cenar sin éxito, siendo interrumpidos por eventos surrealistas.', 1972, 'Francia/España', 102, 'Sátira, Buñuel.', 8, 1),
('Traffic', 'Traffic', 'Historias cruzadas sobre el narcotráfico y sus efectos en varios niveles sociales.', 2000, 'EE. UU.', 147, 'Steven Soderbergh, fotografía con tonos diferentes.', 4, 3);

INSERT INTO horario_funcion (fecha_hora_transmision, id_pelicula) VALUES
('2025-12-15 18:00:00', 1), ('2025-12-15 20:30:00', 2), ('2025-12-16 17:00:00', 3), ('2025-12-16 22:00:00', 4), ('2025-12-17 19:30:00', 5),
('2025-12-17 16:00:00', 6), ('2025-12-18 18:00:00', 7), ('2025-12-18 21:00:00', 8), ('2025-12-19 19:00:00', 9), ('2025-12-19 16:00:00', 10),
('2025-12-20 17:30:00', 11), ('2025-12-20 20:45:00', 12), ('2025-12-21 16:30:00', 13), ('2025-12-21 19:45:00', 14), ('2025-12-22 17:00:00', 15),
('2025-12-22 21:30:00', 16), ('2025-12-23 18:30:00', 17), ('2025-12-23 20:00:00', 18), ('2025-12-24 16:00:00', 19), ('2025-12-24 19:00:00', 20),
('2025-12-25 17:30:00', 21), ('2025-12-25 22:00:00', 22), ('2025-12-26 18:00:00', 23), ('2025-12-26 20:15:00', 24), ('2025-12-27 16:45:00', 25),
('2025-12-27 19:30:00', 26), ('2025-12-28 17:00:00', 27), ('2025-12-28 20:00:00', 28), ('2025-12-29 18:30:00', 29), ('2025-12-29 21:45:00', 30);

INSERT INTO cine_capsula (titulo_capsula, descripcion, duracion_minutos, fecha_transmision, id_pelicula) VALUES
('Entrevista con Alfonso Cuarón', 'El director habla sobre el proceso creativo de Roma.', 8, '2025-12-15 17:45:00', 1),
('Análisis Visual: Yojimbo', 'Estudio sobre la composición de planos en el film de Kurosawa.', 5, '2025-12-15 20:00:00', 2),
('Detrás de Escena: 2001', 'Cómo se lograron los efectos especiales sin computadoras.', 12, '2025-12-16 16:45:00', 3),
('Mini-Doc: La Guerra Civil Española', 'Contexto histórico para El laberinto del fauno.', 10, '2025-12-16 21:45:00', 4),
('Maestros del Suspense: Hitchcock', 'Especial sobre la técnica de Alfred Hitchcock en Vértigo.', 7, '2025-12-17 19:00:00', 5),
('La Música de Pulp Fiction', 'Análisis de la banda sonora y su influencia en el cine.', 6, '2025-12-17 15:45:00', 6),
('Buñuel: El Surrealismo Mexicano', 'Especial sobre la etapa de Buñuel en México.', 8, '2025-12-18 17:45:00', 7),
('Moda y Cine: The Piano', 'La importancia del vestuario en la película.', 5, '2025-12-18 20:45:00', 8),
('Bergman y la Identidad', 'Reflexión sobre los temas de identidad en Persona.', 9, '2025-12-19 18:45:00', 9),
('Venganza en el Cine Coreano', 'Un vistazo a las películas de venganza tras Oldboy.', 7, '2025-12-19 15:45:00', 10),
('Especial: Cine de Autor', 'Análisis de las características del cine de autor.', 10, '2025-12-20 17:00:00', NULL), -- Genérica
('La Fotografía en Blanco y Negro', 'Técnicas de fotografía.', 6, '2025-12-20 20:30:00', NULL), -- Genérica
('Cine y Derechos Humanos', 'Documental sobre el impacto social.', 15, '2025-12-21 16:15:00', NULL), -- Genérica
('Detrás de Amélie: París', 'Los escenarios y la inspiración de la película.', 7, '2025-12-22 16:45:00', 15),
('El Cine Negro Español', 'Las influencias de La isla mínima.', 8, '2025-12-22 21:15:00', 16),
('Clase Social en Parasite', 'Cómo la película aborda la división de clases.', 9, '2025-12-23 18:15:00', 17),
('Woody Allen y el Viaje en el Tiempo', 'El uso de la fantasía en Midnight in Paris.', 6, '2025-12-23 19:45:00', 18),
('Efectos Prácticos en Furia', 'El rodaje de Mad Max: Fury Road.', 11, '2025-12-24 15:45:00', 19),
('Mitología en El Laberinto', 'Los símbolos y referencias mitológicas en la película.', 8, '2025-12-24 18:45:00', 20),
('La Trilogía del Padrino', 'El impacto cultural y narrativo de la saga.', 10, '2025-12-25 17:15:00', 21),
('Adicciones en el Cine', 'Representación de las adicciones en Réquiem por un Sueño.', 7, '2025-12-25 21:45:00', 22),
('La Construcción de Babel', 'Cómo se entrelazan las narrativas.', 9, '2025-12-26 17:45:00', 23),
('Estética Neon: Drive', 'El estilo visual y la música de la película.', 6, '2025-12-26 20:00:00', 24),
('Mundo de Espíritus: Chihiro', 'Análisis de la animación japonesa.', 8, '2025-12-27 16:30:00', 25),
('Cine y Familia: Fanny y Alexander', 'La autobiografía de Bergman.', 10, '2025-12-27 19:15:00', 26),
('El Misterio de Blue Velvet', 'El tono surrealista y el terror psicológico.', 7, '2025-12-28 16:45:00', 27),
('Cine Iraní Contemporáneo', 'El estilo de Close-Up.', 9, '2025-12-28 19:45:00', 28),
('Sátira Social en Buñuel', 'El uso del humor negro en El discreto encanto...', 6, '2025-12-29 18:15:00', 29),
('Política y Tráfico', 'El enfoque político de la película Traffic.', 11, '2025-12-29 21:30:00', 30),
('Especial: El Catálogo de Cinema 22', 'Un resumen de la programación mensual.', 15, '2025-12-30 19:00:00', NULL); -- Genérica

-- Consulta para tipo_cine (Catálogo)
SELECT * FROM tipo_cine;

-- Consulta para director (Catálogo)
SELECT * FROM director;

-- Consulta para pelicula (30 Registros)
SELECT * FROM pelicula;

-- Consulta para horario_funcion (30 Registros)
SELECT * FROM horario_funcion;

-- Consulta para cine_capsula (30 Registros)
SELECT * FROM cine_capsula;