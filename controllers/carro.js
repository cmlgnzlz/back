const {logger} = require('../config/logger');
const Carrito = require('../service/carro');
let Carro = new Carrito();

async function getCarrito(req,res) {
    logger.info(`ruta '/api/carrito${req.url}' metodo '${req.method}'`);
    if (req.isAuthenticated()) {
        const carrId = req.user.carrito;
        const user = req.user.username;
        Carro
            .getUserInfo(carrId)
            .then(() => res.render('carrito.pug', { carrito:Carro.carro, usuario:user, userdata:Carro.userdata } ));
    } else {
        res.render('login.pug')
    }
}

async function postCarrito(req,res) {
    logger.info(`ruta '/api/carrito${req.url}' metodo '${req.method}'`);
    if (req.isAuthenticated()) {
        const carrId = req.user.carrito;
        const user = req.user.username;
        Carro
            .sendUserCart(carrId)
            .then(() => res.render('carritoSend.pug', { carrito:carrId, usuario:user} ));
    } else {
        res.render('login.pug')
    }
}

async function postProd(req, res) {
    logger.info(`ruta '/api/carrito${req.url}' metodo '${req.method}'`);
    const { id,id_prod } = req.params;
    Carro
        .addProdByCartId(id,id_prod)
        .then(() => res.json(Carro.carro));
}

async function deleteProd(req, res) {
    logger.info(`ruta '/api/carrito${req.url}' metodo '${req.method}'`);
    const { id,id_prod } = req.params;
    Carro
        .deleteProdByCartId(id,id_prod)
        .then(() => res.json(Carro.carro));
}


module.exports = {getCarrito, postCarrito, postProd, deleteProd}