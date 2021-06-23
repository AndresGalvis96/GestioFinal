var moment = require('moment');
var Mensaje = require('../models/Mensaje');


function saveMensaje(req, res){    
    var params = req.body;
    var Mensaje = new Mensaje();     

    if(!params.text || !params.receiver) return res.status(200).send({message: "Debe llenar todos los campos"});
    Mensaje.emitter = req.user.sub;
    Mensaje.receiver = params.receiver;
    Mensaje.text = params.text;
    Mensaje.created_at = moment().unix();
    Mensaje.viewed = "false";
    Mensaje.save((err, MensajeGuardado) => {
       if(err) return res.status(500).send({message: "Se ha producido un error."});
       if(!MensajeGuardado) return res.status(500).send({message: "Se ha producido un error."});

       return res.status(200).send({message: MensajeGuardado});
    });
}

function getMensajesRecibidos(req, res){ 
    var ususarioId = req.user.sub;
    var pagina = 1;
    var itemsPorPagina = 4;

    if(req.params.pagina){
        pagina = req.params.pagina;
    }
                                                             
    Mensaje.find({receiver: ususarioId}).populate('emitter', 'alias img').paginate(pagina, itemsPorPagina, (err, Mensajes, total) => {
        if(err) return res.status(500).send({message: "Se ha producido un error."});
        if(!Mensajes) return res.status(500).send({message: "No hay Mensajes."});

        return res.status(200).send({
            total: total,
            paginas: Math.ceil(total/itemsPorPagina),
            Mensajes
        });
    });
}

function getMensajesEnviados(req, res){ 
    var ususarioId = req.user.sub;
    var pagina = 1;
    var itemsPorPagina = 4;

    if(req.params.pagina){
        pagina = req.params.pagina;
    }

    Mensaje.find({emitter: ususarioId}).populate('emitter receiver', 'alias img').paginate(pagina, itemsPorPagina, (err, Mensajes, total) => {
        if(err) return res.status(500).send({message: "Se ha producido un error."});
        if(!Mensajes) return res.status(500).send({message: "No Mensajes."});

        return res.status(200).send({
            total: total,
            paginas: Math.ceil(total/itemsPorPagina),
            Mensajes
        });
    });
}

function getMensajesNoVistos(req, res){
    var ususarioId = req.user.sub;

    Mensaje.count({receiver:ususarioId, viewed: "false"}).exec((err, contador) => {
        if(err) return res.status(500).send({message: "Se ha producido un error."});
        return res.status(200).send({
            'noVIsto': contador     
        })
    });
}

function marcarComoLeidos(req, res){
    var ususarioId = req.user.sub;

    Mensaje.update({receiver:ususarioId, viewed:'false'}, {viewed:'true'}, {"multi":true}, (err, MensajesActualizados) => {
        if(err) return res.status(500).send({message: "Se ha producido un error."});
        return res.status(200).send({
            Mensaje: MensajesActualizados 
        });
    });
}

module.exports = {
    saveMensaje,
    getMensajesRecibidos,
    getMensajesEnviados,
    getMensajesNoVistos,
    marcarComoLeidos    
}