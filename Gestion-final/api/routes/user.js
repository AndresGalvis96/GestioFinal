var express = require('express');
var UserController = require('../controllers/user');
var api = express.Router();
var mdAuth = require('../middleware/autenticacion');
var multiplart = require('connect-multiparty');
var mdUpload = multiplart({uploadDir: './uploads/usuarios'});

api.post('/registro', UserController.saveUsuario);
api.post('/login', UserController.loginUsuario);
api.get('/usuario/:id', mdAuth.ensureAuth, UserController.getUsuario);
api.get('/usuarios/:pagina?', mdAuth.ensureAuth, UserController.getUsuarios);
api.put('/actualizarUsuario/:id', mdAuth.ensureAuth, UserController.updateUsuarios);
api.post('/subirImagenUsuario/:id', [mdAuth.ensureAuth, mdUpload], UserController.subirImagen);
api.get('/getImagenUsuario/:imageFile', UserController.getImagen);


module.exports = api;