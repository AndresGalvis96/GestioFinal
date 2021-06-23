var path = require('path');
var moment = require('moment');
var Publicacion = require('../models/publicacion');
var Amigo = require('../models/amigos');
var user = require('../models/user');


function savePublicacion(req, res){
    var params = req.body;
    var publicacion = new Publicacion();

    if(!params.text) return res.status(200).send({message: "Para hacer una publicación debes escribir algo."});
    publicacion.text = params.text;
    publicacion.file = 'null';
    publicacion.user = req.user.sub;
    publicacion.created_at = moment().unix();

    publicacion.save((err, publicacionAlmacenada) => {
        if(err) return res.status(500).send({message: "Se ha producido un error al guardar la publicación."});
        if(!publicacionAlmacenada) return res.status(404).send({message: "No se ha podido guardar la publicación."});
        
        return res.status(200).send({publicacion: publicacionAlmacenada});
    });

}

function getPublicaciones(req, res){
    var pagina = 1;
    var itemsPorPagina = 4;

    if(req.params.pagina){
        pagina = req.params.pagina;
    }

    Amigo.find({user: req.user.sub}).populate('agregado').exec((err, amigos) => {
        var listaAmigos = [];

        if(err) return res.status(500).send({message: "Se ha producido un error."});

        amigos.forEach((amigo) => {
            listaAmigos.push(amigo.agregado);
        });

        console.log(listaAmigos);

        Publicacion.find({user: {"$in": listaAmigos}}).sort('created_at').populate('user').paginate(pagina, itemsPorPagina, (err, publicaciones, total) => {
            if(err) return res.status(500).send({message: "Se ha producido un error."});
            console.log(publicaciones);
            if(!publicaciones) return res.status(404).send({message: "No hay publicaciones."});
            
            return res.status(200).send({
                total: total,
                paginas: Math.ceil(total/itemsPorPagina),
                pagina: pagina,
                publicaciones
            })
        });
    });

}

function getPublicacion (req, res){
    var idPublicacion = req.params.id;

    Publicacion.findById(idPublicacion, (err, publicacion) => {
        if(err) return res.status(500).send({message: "Se ha producido un error."});
        if(!publicacion) return res.status(404).send({message: "La publicación no existe."});

        return res.status(200).send({publicacion});
    });
}

function deletePublicacion(req, res){
    var idPublicacion = req.params.id;

    Publicacion.find({'user': req.user.sub, '_id': idPublicacion}).remove(err => {
        if(err) return res.status(500).send({message: "Se ha producido un error."});
        
        return res.status(200).send({message: "La publicación ha sido eliminada."});
    });
}

module.exports = {
    savePublicacion,
    getPublicaciones,
    getPublicacion,
    deletePublicacion
}