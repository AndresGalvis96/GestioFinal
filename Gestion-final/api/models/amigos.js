var mongoose = require('mongoose');
var schema = mongoose.Schema;

var AmigosSchema = schema({
    user: { type: schema.ObjectId, ref: 'User'},
    agregados: { type: schema.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('amigo', AmigosSchema);