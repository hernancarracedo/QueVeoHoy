let conex = require('../lib/conexionbd.js');

function getPeliculas(req, res){
    var filtros = [];

    if (req.query.anio !== undefined) {
        filtros.push("anio = "+ req.query.anio);
    }

    if (req.query.titulo !== undefined){
        filtros.push('titulo like "%' + req.query.titulo + '%"');
    }

    if (req.query.genero !== undefined){
        filtros.push("genero_id = "+ req.query.genero);
    }
    
    // recupero el resto de los parametros de la ruta
    let pagina = req.query.pagina
    let cantidad = req.query.cantidad
    let columna_orden = req.query.columna_orden
    let tipo_orden = req.query.tipo_orden

    let sql;

    if (filtros.length == 0) { // si no se aplicó filtro ni a "genero", ni a "titulo", ni a "anio"
        sql = "select * FROM pelicula";
    } else { // si al menos se aplicó un filtro
        sql = "select * FROM pelicula WHERE ";
        for (var i=0; i<filtros.length; i++) { 
            sql = sql + filtros[i];
            if (i+1 !== filtros.length){ // chequeo si quedan mas filtros para aplicar y agrego un "and "
                sql = sql + ' AND ';
            }
        }
    }


    let registro_inicial = pagina * cantidad - 52;

    sql = sql + ' ORDER BY ' + columna_orden + ' ' + tipo_orden;
    
    conex.query(sql, function(error, resultadoTodas, fields){
        if (error) {
            console.log("Ha ocurrido un error en la consulta", error.message);
            return res.status(404).send("Ha ocurrido un error en la consulta");
        }
      
        //AGREGO A LA CONSULTA ORIGINAL EL LIMIT PARA EL PAGINADO DE LOS RESULTADOS DE "52"
        sql2 = sql + ' LIMIT '+registro_inicial+','+cantidad;
        
        conex.query(sql2, function(errorPagina, resultadoPagina, fieldsPagina){
            if (error) {
                console.log("Ha ocurrido un error en la consulta", error.message);
                return res.status(404).send("Ha ocurrido un error en la consulta");
            }

            var response = {
               peliculas : resultadoPagina,
               total : resultadoTodas.length
            }

            res.send(JSON.stringify(response));
        });
    });
}

// FUNCION QUE ENVIA AL FRONT TODOS LOS GENEROS POSIBLES PARA CONSTRUIR UNO DE LOS FILTROS
function getGeneros(req, res){
    let sql = "select * from genero";
    
    conex.query(sql, function(error, resultado, fields){
        if (error) {
            console.log("Ha ocurrido un error en la consulta", error.message);
            return res.status(404).send("Ha ocurrido un error en la consulta");
        }
        var response = {
            generos : resultado
        }
        res.send(JSON.stringify(response));

    });
}


// obtengo toda la info de un id de pelicula solicitado
function getPelicula(req, res){
    let id = req.params.id;

    let sqlPeli = "SELECT * FROM genero LEFT JOIN pelicula on genero.id = pelicula.genero_id WHERE pelicula.id = "+id;     
    let sqlActores = "SELECT actor.nombre FROM actor LEFT JOIN actor_pelicula on actor.id = actor_pelicula.actor_id LEFT JOIN pelicula ON pelicula.id = actor_pelicula.pelicula_id WHERE pelicula.id = "+id; 

    conex.query(sqlPeli, function(error, resultadoPeli, fields){
        if (error) {
            console.log("Ha ocurrido un error en la consulta", error.message);
            return res.status(404).send("Ha ocurrido un error en la consulta");
        }
      
        conex.query(sqlActores, function(error, resultadoActores, fields){
            if (error) {
                console.log("Ha ocurrido un error en la consulta", error.message);
                return res.status(404).send("Ha ocurrido un error en la consulta");
            }

            var response = {
                pelicula : resultadoPeli[0],
                actores : resultadoActores,
            }
                
            res.send(JSON.stringify(response));
        });

    });
}

function getRecomendacion(req, res){
    var sql; // en esta variable asignaré la cadena de la query a ejecutar en la DB segun la ruta requerida
    var filtros = []; // en este array voy a ir agregando todos los filtros del WHERE de la query si hubiera.

    if ((req.query.puntuacion == undefined) && (req.query.anio_inicio == undefined) && (req.query.anio_fin == undefined) && (req.query.genero == undefined)) {
        sql = "select * FROM pelicula LEFT JOIN genero ON pelicula.genero_id = genero.id";
    } else {
        sql = "select * FROM pelicula LEFT JOIN genero ON pelicula.genero_id = genero.id WHERE ";

        if (req.query.puntuacion !== undefined){
            filtros.push("puntuacion > " + req.query.puntuacion);
        } 
        if ((req.query.anio_inicio !== undefined) && (req.query.anio_fin !== undefined)){
            filtros.push("anio BETWEEN " + req.query.anio_inicio + " AND " + req.query.anio_fin);
        }
        if (req.query.genero !== undefined){
            filtros.push("genero.nombre = '" + req.query.genero +"'");
        }

        // hago un for para armar la query completa recorriendo array filtros que hice push en las lineas anteriores
        for (var i=0; i<filtros.length; i++) { 
            sql = sql + filtros[i];
            if (i+1 !== filtros.length){ // chequeo si quedan mas filtros para aplicar y agrego un "and "
                sql = sql + ' AND ';
            }
        }
    }   
    
    conex.query(sql, function(error, resultado, fields){
        if (error) {
            console.log("Ha ocurrido un error en la consulta", error.message);
            return res.status(404).send("Ha ocurrido un error en la consulta");
        }
        var response = {
            peliculas : resultado
        }
        res.send(JSON.stringify(response));
    });
}

module.exports = {
    getPeliculas,
    getGeneros,
    getPelicula,
    getRecomendacion
};