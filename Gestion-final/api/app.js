var express = require('express');
var bodyParser = require('body-parser');
var app = express();


var userRoutes = require('./routes/user');
var amigoRoutes = require('./routes/amigo');
var publicacionRoutes = require('./routes/publicacion');
var comentarioRoutes = require('./routes/comentario');
var mensajeRoutes = require('./routes/mensaje')
var solicitudRoutes = require('./routes/solicitud')

var packg =require ('./package.json');

app.set('package', packg);

app.get('/',(req, res )=>{
    res.json({
        name: app.get('package').name,
        author: app.get('package').author,
        description: app.get('package').descripcion,
        version: app.get('package').version
    })
})


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());



//Cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

app.use('/api', userRoutes);
app.use('/api', amigoRoutes);
app.use('/api', publicacionRoutes);
app.use('/api', comentarioRoutes);
app.use('/api', mensajeRoutes);
app.use('/api', solicitudRoutes)

module.exports = app;