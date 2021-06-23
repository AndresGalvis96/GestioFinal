var express = require("express");
var AmigoController = require("../controllers/amigo");
var api = express.Router();
var mdAuth = require("../middleware/autenticacion");

api.post("/amigo", mdAuth.ensureAuth, AmigoController.agregar);
api.delete("/amigo/:id", mdAuth.ensureAuth, AmigoController.eliminarAmigo);
api.get("/amigos/:id?/:page?", mdAuth.ensureAuth, AmigoController.listarAmigos);


module.exports = api;