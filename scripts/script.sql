create database queveohoy;

use queveohoy;

CREATE TABLE pelicula (
    id INT NOT NULL auto_increment,
    titulo VARCHAR(100) NOT NULL,
    duracion INT(5),
    director VARCHAR(400),
    anio INT(5),
    fecha_lanzamiento DATE,
    puntuacion INT(20),
    poster VARCHAR(300),
    trama VARCHAR(700),
    PRIMARY KEY (id)
);

CREATE TABLE genero (
    id INT NOT NULL auto_increment,
    nombre VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE pelicula ADD COLUMN genero_id INT(2);

CREATE TABLE actor (
    id INT NOT NULL auto_increment,
    nombre VARCHAR(70) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE actor_pelicula (
    id INT NOT NULL auto_increment,
    actor_id INT NOT NULL,
    pelicula_id INT NOT NULL,
    PRIMARY KEY (id)
);

