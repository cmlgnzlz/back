const mongoose = require('mongoose');

const esquemaProd = new mongoose.Schema({
    name: {type: String, require:true},
    price: {type: Number, require:true},
    img: {type: String, require:true},
    desc:  {type: String, require:true},
    cat: {type: String, require:true}
});

module.exports = mongoose.model('productos', esquemaProd);