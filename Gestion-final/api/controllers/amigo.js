var Amigo = require('../models/amigos');

function agregar (req, res){
    var params = req.body;
    var amigo = new Amigo();
    
    amigo.user = req.user.sub;
    amigo.agregado = params.agregados;

    amigo.save((err, amigoStored) => {
        if(err) return res.status(500).send({message: "Error al enviar solicitud."});
        if(!amigoStored) return res.status(404).send({message: "No has podido agregar este usuario."});
        return res.status(200).send({agregado:amigoStored});  
    });
} 

const getFriendById = async(req, res)=>{
    const amigo= await Amigo.findById(req.params.id);
    res.estatus(200).json(amigo)

}
const updateFriendById = async (req, res)=>{
    try {
    const updatedFriend =await Amigo.findByIdAndUpdate(req.params.id)
     
        res.status(200).json(updatedFriend)
    
} catch (err) {
    return res.status(500).send({message: "Error al actualizar."});
}
   
}


const deleteFriendById =async(req, res)=>{
    try {
  const deletedAmigo =  await Amigo.findByIdAndDelete(req.param.id)
  res.status(204).json()
} catch (err) {
    return res.status(500).send({message: "Error al eliminar usuario."});
}
}


function eliminarAmigo(req, res){ 
    var usuarioId = req.user.sub;
    var aggId = req.params.id;

    Amigo.find({"user":usuarioId, "agregados":aggId}).remove(err => {
        if(err) return res.status(500).send({message: "Error al eliminar usuario."});
        return res.status(200).send({message: "Has eliminado este usuario."});
    });
}

function listarAmigos(req, res){
    var usuarioId = req.user.sub;
    var pagina = 1;
    var itemsPorPagina = 4;

    if(req.params.id && req.params.pagina){
        usuarioId = req.params.id;
    }

    if(req.params.pagina){
        pagina = req.params.pagina;
    }else{
        pagina = req.params.id;
    }

    Amigo.find({user:usuarioId}).populate("user agregado").paginate(pagina, itemsPorPagina, (err, amigos, total) => {
        if(err) return res.status(500).send({message: "Se ha producido un error."});
        if(!amigos) return res.status(404).send({message: "No tienes amigos."});

        return res.status(200).send({
            total: total,
            paginas: Math.ceil(total/itemsPorPagina),
            amigos
        });
    });
}
function bucarAmigo(req, res){
    var usuarioId = req.user.sub;

    var buscar = Amigo.find({user: usuarioId});
    
    if(req.params.agregado){
        var buscar = Amigo.find({agregado: usuarioId});
    }
    
    buscar.populate("user agregado").exec((err, amigos) => {
        if(err) return res.status(500).send({message: "Se ha producido un error."});
        if(!amigos) return res.status(404).send({message: "No tienes amigos."});

        return res.status(200).send({ amigos });
    });
}

module.exports = {
    agregar,
    eliminarAmigo,
    listarAmigos,
    bucarAmigo
}