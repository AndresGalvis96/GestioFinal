var express = require("express");
var PublicacionController = require("../controllers/publicacion");
var api = express.Router();
var mdAuth = require("../middleware/autenticacion");

api.post('/publicacion', mdAuth.ensureAuth, PublicacionController.savePublicacion);
api.get('/publicaciones/:pagina?', mdAuth.ensureAuth, PublicacionController.getPublicaciones);
api.get('/publicacion/:id', mdAuth.ensureAuth, PublicacionController.getPublicacion);
api.delete('/publicacion/:id', mdAuth.ensureAuth, PublicacionController.deletePublicacion);

module.exports = api;