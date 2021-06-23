
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'claveultrasecreta';

exports.createToken = function(usuario){
    const payload = {
        sub: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        alias: usuario.alias,
        email: usuario.email,
        rol: usuario.rol,
        imagen: usuario.imagen,
        iat: moment().unix(),
        exp: moment().add(3, 'days').unix
    }

    return jwt.encode(payload, secret);
}