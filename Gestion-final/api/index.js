var mongoose = require('mongoose');
var app = require('./app');
var port = 3000;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/cov_net', { useNewUrlParser: true }) 
.then(() => {
    console.log("Conexión creada con éxito.");
app.listen(port, () => {
        console.log("El servidor está corriendo...");
    });
})
.catch(err => console.log(err));