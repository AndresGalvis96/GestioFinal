var mongoose = require('mongoose');
var schema = mongoose.Schema;
var solicitudSchema = schema({
    emitter: {type: schema.ObjectId,  ref: 'User'},
    receiver: {type: schema.ObjectId,  ref: 'User'},
    aceptada: String,
    created_at: String
});

module.exports = mongoose.model('Solicitud', solicitudSchema);