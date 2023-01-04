const mongoose = require('mongoose');

const esquemaOrden = new mongoose.Schema({
    email: {type: String, require:true},
    fyh: {type: String, require:true},
    productos: {type:[], require:true},
    userdata: {type:[], require:true},
    estado: {type: String, require:true},
    numero: {type: Number, require:true},
});

module.exports = mongoose.model('ordenes', esquemaOrden);