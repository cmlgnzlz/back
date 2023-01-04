const mongoose = require('mongoose');

const esquemaChat = new mongoose.Schema({
    email: {type: String, require:true},
    tipo: {type: String, require:true},
    fyh: {type: String, require:true},
    msg:  {type: String, require:true}
});

module.exports = mongoose.model('mensajes', esquemaChat);