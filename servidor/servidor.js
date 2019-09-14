//paquetes necesarios para el proyecto
const express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');


var app = express();

var controller = require('../servidor/controladores/controller');

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = '8080';

app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});

app.get('/peliculas/recomendacion', controller.getRecomendacion);
app.get('/peliculas', controller.getPeliculas);
app.get('/generos', controller.getGeneros);
app.get('/peliculas/:id', controller.getPelicula);



