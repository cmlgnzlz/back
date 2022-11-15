const mongoose = require('mongoose');
const esquemaProd = new mongoose.Schema({
    id: {type: Number, require:true},
    name: {type: String, require:true},
    price: {type: Number, require:true},
    qty: {type: Number, require:true},
    img: {type: String, require:true},
    desc:  {type: String, require:true},
    code: {type: Number, require:true}
});

module.exports = mongoose.model('productos', esquemaProd);