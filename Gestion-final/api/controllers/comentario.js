var moment = require('moment');
var Coment = require('../models/comentario');


function saveComent(req, res){    
    var params = req.body;
    var comentario = new Coment();     

    if(!params.text || !params.receiver) return res.status(200).send({message: "Debe escribir algo"});
    comentario.emitter = req.user.sub;
    comentario.receiver = params.receiver;
    comentario.text = params.text;
    comentario.created_at = moment().unix();
    comentario.viewed = "false";
    comentario.save((err, comentarioGuardado) => {
       if(err) return res.status(500).send({message: "Se ha producido un error."});
       if(!comentarioGuardado) return res.status(500).send({message: "Se ha producido un error."});

       return res.status(200).send({message: comentarioGuardado});
    });
}

function getComentariosRecibidos(req, res){ 
    var ususarioId = req.user.sub;
    var pagina = 1;
    var itemsPorPagina = 4;

    if(req.params.pagina){
        pagina = req.params.pagina;
    }
                                                             
    Coment.find({receiver: ususarioId}).populate('emitter', 'alias img').paginate(pagina, itemsPorPagina, (err, comentarios, total) => {
        if(err) return res.status(500).send({message: "Se ha producido un error."});
        if(!comentarios) return res.status(500).send({message: "No hay comentarios."});

        return res.status(200).send({
            total: total,
            paginas: Math.ceil(total/itemsPorPagina),
            comentarios
        });
    });
}

function getComentsEnviados(req, res){ 
    var ususarioId = req.user.sub;
    var pagina = 1;
    var itemsPorPagina = 4;

    if(req.params.pagina){
        pagina = req.params.pagina;
    }

    Coment.find({emitter: ususarioId}).populate('emitter receiver', 'alias img').paginate(pagina, itemsPorPagina, (err, comentarios, total) => {
        if(err) return res.status(500).send({message: "Se ha producido un error."});
        if(!comentarios) return res.status(500).send({message: "No haycomentarios."});

        return res.status(200).send({
            total: total,
            paginas: Math.ceil(total/itemsPorPagina),
            comentarios
        });
    });
}

function getComentsNoVistos(req, res){
    var ususarioId = req.user.sub;

    Coment.count({receiver:ususarioId, viewed: "false"}).exec((err, contador) => {
        if(err) return res.status(500).send({message: "Se ha producido un error."});
        return res.status(200).send({
            'noVIsto': contador     //avriguar los dos puntos
        })
    });
}

function marcarComoLeidos(req, res){
    var ususarioId = req.user.sub;

    Coment.update({receiver:ususarioId, viewed:'false'}, {viewed:'true'}, {"multi":true}, (err, comentariosActualizados) => {
        if(err) return res.status(500).send({message: "Se ha producido un error."});
        return res.status(200).send({
            comentario: comentariosActualizados //avriguar los dos puntos
        });
    });
}

module.exports = {
    saveComent,
    getComentariosRecibidos,
    getComentsEnviados,
    getComentsNoVistos,
    marcarComoLeidos    
}