var express = require('express');
var MensajeController = require('../controllers/mensaje');
var api = express.Router();
var mdAuth = require('../middleware/autenticacion');


api.post('/mensajes', mdAuth.ensureAuth, MensajeController.saveMensaje);
api.get('/mensajes/:pagina?', mdAuth.ensureAuth, MensajeController.getMensajesRecibidos);
api.get('/mensajesEnviados/:pagina?', mdAuth.ensureAuth, MensajeController.getMensajesEnviados);
api.get('/mensajesSinVer', mdAuth.ensureAuth, MensajeController.getMensajesNoVistos);
api.get('/marcarLeido', mdAuth.ensureAuth, MensajeController.marcarComoLeidos);

module.exports = api;