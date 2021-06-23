var express = require('express');
var ComentController = require('../controllers/comentario');
var api = express.Router();
var mdAuth = require('../middleware/autenticacion');

api.post('/comentario', mdAuth.ensureAuth, ComentController.saveComent);
api.get('/Comentarios/:pagina?', mdAuth.ensureAuth, ComentController.getComentariosRecibidos);
api.get('/comentPosted/:pagina?', mdAuth.ensureAuth, ComentController.getComentsEnviados);
api.get('/comentariosSinVer', mdAuth.ensureAuth, ComentController.getComentsNoVistos);
api.get('/marcarLeido', mdAuth.ensureAuth, ComentController.marcarComoLeidos);

module.exports = api;


