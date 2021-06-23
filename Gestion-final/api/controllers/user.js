var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');
var User = require('../models/user');
var Amigos = require('../models/amigos');
var jwt = require('../token/jwt');
var Publicacion = require('../models/publicacion');

function saveUsuario(req, res){
    var params = req.body;
    var usuario = new User();

    if(params.nombre && params.apellidos && params.alias && params.email && params.password){
        usuario.nombre = params.nombre;
        usuario.apellidos = params.apellidos;
        usuario.alias = params.alias;
        usuario.email = params.email;
        usuario.rol = 'rol_usuario';
        usuario.imagen = null;

        //Evitar que se introduzca un usuario que existe en la BD
        User.find({ $or: [
                                    {email: usuario.email.toLowerCase()},
                                    {alias: usuario.alias.toLowerCase()}
                                    
                            ]}).exec((err, users) => {
                                if(err) return res.status(500).send({ message: 'Error al procesar.'});
                                if(users && users.length >= 1){
                                    return res.status(200).send({ message: 'El usuario ya existe.'});
                                }else{
                                    
                            //Cifrado de contraseña y guarda datos
                            bcrypt.hash(params.password, null, null, (err, hash) => {
                            usuario.password = hash;
                            usuario.save((err, userStored) => {
                                if(err) return res.status(500).send({ message: 'Error al guardar el usuario.'});
                                if(userStored){
                                    res.status(200).send({user: userStored});
                                }else{
                                    res.status(404).send({message: 'No se ha registrado el usuario.'});
                                }
                            })
                        });
                    }
                });


    }else{
        res.status(200).send({
            message: 'Completa todos los campos'
        })
    }
}

function loginUsuario(req, res){
    var params = req.body;
    var email = params.email;
    var password = params.password;

    User.findOne({email: email}, (err, usuario) => {
        if(err) return res.status(500).send({message: 'Error al procesar.'}); 
        if(usuario){
            bcrypt.compare(password, usuario.password, (err, check) => {
                if(check){
                    if(!params.gettoken){
                        return res.status(200).send({
                             token: jwt.createToken(usuario)
                        }); 
                    }else{
                        usuario.password = undefined;
                        return res.status(200).send({usuario});
                    }
                    
                }else{
                    return res.status(404).send({message: 'passwords don´t match.'});
                }
            });
        }else{
            return res.status(404).send({message: 'No user found.'});
        }
    });
}

function getUsuario(req, res){
    var usuarioId = req.params.id;

    User.findById(usuarioId, (err, usuario) => {
        if(err) return res.status(500).send({message: 'Error al procesar.'});
        if(!usuario) return res.status(404).send({message: 'El usuario no existe.'});
    
        agregarUsuario(req.user.sub, usuarioId).then((valor) => {
            return res.status(200).send({usuario, "Amigos": valor.agregados});
        });

    });
}

async function agregarUsuario(identidadUsuario, usuarioId){
    var agregados = await Amigos.findOne({"user":identidadUsuario, "agregado":usuarioId}).then((agregados) => { //followed en todo lado
        return agregados;
    });

    return{
       agregados:agregados
       
    }
}

function getUsuarios(req, res){
    var idUsuario = req.user.sub;
    var pagina = 1;
    var itemsPorPagina = 5;

    if(req.params.pagina){
        pagina = req.params.pagina;
    }

    User.find().sort('_id').paginate(pagina, itemsPorPagina, (err, usuarios, total) => {
        if(err) return res.status(500).send({message: 'Error en la petición.'});
        if(!usuarios) return res.status(404).send({message: 'No hay usuarios disponibles'});

        usuariosAgregados(idUsuario).then((valor) => {
            
            return res.status(200).send({
                usuarios,
                usuariosAmigos: valor.agregados,
                total,
                paginas: Math.ceil(total/itemsPorPagina)
            });
        });

    });

}

async function usuariosAgregados(usuarioId){
    var listaAmigos= [];
    

    var agregados = await Amigos.find({"user":usuarioId}).select({"_id":0, "_v":0, "user":0}).then((agregados) => {
        return agregados;
    });

    agregados.forEach((Amigos) => {
        listaAmigos.push(Amigos.agregado);
    });

    return{
        agregados: listaAmigos,
       
    }
}

function contador(req, res){
    var usuarioId = req.user.sub;
    if(req.params.id){
        usuarioId = req.params.id;
    }
    
    publicacionesrAmigos(usuarioId).then((valor) => {
        return res.status(200).send(valor);
    });
    var publicaciones = await Publicacion.count({"user":usuarioId}).then((publicaciones) => {
        return publicaciones;
    });

    return {
        agregados: agregados,
        publicaciones: publicaciones
    }
}

async function publicacionesrAmigos(usuarioId){
    var agregados = await Amigos.count({"user":usuarioId}).then((agregados) => {
        return agregados;
    });

    var publicaciones = await Publicacion.count({"user":usuarioId}).then((publicaciones) => {
        return publicaciones;
    });

    return {
        agregados: agregados,
        publicaciones: publicaciones
    }
}

function updateUsuarios(req, res){
    var usuarioId = req.params.id;
    var actualizar = req.body;

    delete actualizar.password;

    if(usuarioId != req.user.sub){
        return res.status(500).send({message: 'No tienes permiso para actualizar los datos del usuario.'});
    }

    User.findByIdAndUpdate(usuarioId, actualizar, {new:true}, (err, usuarioActualizado) => {
        
        if(err) return res.status(500).send({message: 'Error en la petición.'});
        if(!usuarioActualizado) return res.status(404).send({message: 'No se ha podido actualizar el usuario.'});

        return res.status(200).send({user: usuarioActualizado});
    });
}

function subirImagen(req, res){
    var usuarioId = req.params.id;
    
    if(req.files){
        var filePath = req.files.image.path;
        var fileSplit = filePath.split('\\');
        var nombreImagen = fileSplit[2];
        var extensionSplit = nombreImagen.split('\.');
        var imagenExt = extensionSplit[1];

        if(usuarioId != req.user.sub){
            return borrarImagenesOUploads(res, filePath, 'No tienes permiso para actualizar los datos del usuario.');
        }

        if(imagenExt == 'png' || imagenExt == 'jpg' || imagenExt == 'jpeg' || imagenExt == 'gif'){
            User.findByIdAndUpdate(usuarioId, {imagen: nombreImagen}, {new:true}, (err, usuarioActualizado) => {
                if(err) return res.status(500).send({message: 'Error en la petición.'});
                if(!usuarioActualizado) return res.status(404).send({message: 'No se ha podido actualizar el usuario.'});
    
                return res.status(200).send({user: usuarioActualizado});
            });
        }else{
            return borrarImagenesOUploads(res, filePath, 'Extensión no válida.');
        }

    }else{
        return res.status(200).send({message: 'No se han subido imágenes.'});
    }
}

function getImagen(req, res){
    var archivo = req.params.imageFile;
    var pathArchivo = './uploads/usuarios/'+archivo;

    fs.exists(pathArchivo, (exists) => {
        if(exists){
            res.sendFile(path.resolve(pathArchivo));
        }else{
            res.status(200).send({message: 'No existe la imagen.'});
        }
    })
}

function borrarImagenesOUploads(res, filePath, message){
    fs.unlink(filePath, (err) => {
        return res.status(200).send({message: message});
        });
}

module.exports = {
    inicio, 
    pruebas, 
    saveUsuario,
    loginUsuario,
    getUsuario,
    getUsuarios,
    updateUsuarios,
    subirImagen,
    getImagen,
    contador
}