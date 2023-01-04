const mongoose = require('mongoose');

const esquemaCarro = new mongoose.Schema({
    id: {type: String, require:true},
    data: {type:[], require:true},
    productos: {type:[], require:true}
});

module.exports = mongoose.model('carro', esquemaCarro);