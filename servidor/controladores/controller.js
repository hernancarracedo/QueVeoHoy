let conex = require('../lib/conexionbd.js');

function getPeliculas(req, res){
    var filtros = [];

    let anio = req.query.anio
    if (anio !== undefined) {
        filtros.push("anio = "+ anio);
    }

    let titulo = req.query.titulo
    if (titulo !== undefined){
        filtros.push('titulo like "%'+titulo+'%"');
    }

    let genero = req.query.genero
    if (genero !== undefined){
        filtros.push("genero_id = "+ genero);
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
    console.log('hola mundo');
}


module.exports = {
    getPeliculas,
    getGeneros,
    getPelicula,
    getRecomendacion
};



/*
console.log(req.query.puntuacion+'\n');
console.log(req.query.anio_inicio+'\n');
console.log(req.query.anio_fin+'\n');
console.log(req.query.genero+'\n');
*/
/*
var sqlRec = "select * FROM pelicula WHERE id = 10";

conex.query(sqlRec, function(error, resultadoRec, fields){
    if (error) {
        console.log("Ha ocurrido un error en la consulta", error.message);
        return res.status(404).send("Ha ocurrido un error en la consulta");
    }
    var response = {
        peliculas : resultadoRec[0]
    }
    res.send(JSON.stringify(response));
});
*/