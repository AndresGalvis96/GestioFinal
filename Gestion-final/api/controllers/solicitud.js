var Solicitud = require('../models/solicitud');

function rechazarSolicitud(req, res){ 
    var usuarioId = req.user.sub;
    var aggId = req.params.id;

    Solicitud.find({"receiver":usuarioId, "emitter":aggId}).remove(err => {
        if(err) return res.status(500).send({message: "Error al eliminar solicitud"});
        return res.status(200).send({message: "Has eliminado esta solicitud."});
    });
}

function getSolicitudesRecibidos(req, res){ 
    var ususarioId = req.user.sub;
    var pagina = 1;
    var itemsPorPagina = 6;

    if(req.params.pagina){
        pagina = req.params.pagina;
    }
                                                             
    Solicitud.find({receiver: ususarioId}).populate('emitter', 'alias img').paginate(pagina, itemsPorPagina, (err, solicitudes, total) => {
        if(err) return res.status(500).send({message: "Se ha producido un error."});
        if(!solicitudes) return res.status(500).send({message: "No tienes solicitudes."});

        return res.status(200).send({
            total: total,
            paginas: Math.ceil(total/itemsPorPagina),
            solicitudes
        });
    });
}
function aceptarSolicitud(req, res){
    var ususarioId = req.user.sub;

    Solicitud.update({receiver:ususarioId, aceptada:'false'}, {aceptada:'true'}, (err, agregado) => {
        if(err) return res.status(500).send({message: "Se ha producido un error."});
        return res.status(200).send({message: "Ahora son amigos" });
    });
}
//agtrgar rutas de solicitudes
//rev app - index
//edit package
modeule.aexports={
    aceptarSolicitud,
    rechazarSolicitud,
    getSolicitudesRecibidos
}