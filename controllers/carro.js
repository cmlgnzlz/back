const {logger} = require('../config/logger');
const Carrito = require('../model/DAOs/carro');
let Carro = new Carrito();

async function getCarrito(req,res) {
    logger.info(`ruta '/carrito${req.url}' metodo '${req.method}'`);
    if (req.isAuthenticated()) {
        const user = req.user.username;
        Carro
            .getUserInfo(user)
            .then(() => res.render('carrito.pug', { carrito:Carro.carro, usuario:user, id:Carro.id } ));
    } else {
        res.render('login.pug')
    }
}

async function postCarrito(req,res) {
    logger.info(`ruta '/carrito${req.url}' metodo '${req.method}'`);
    if (req.isAuthenticated()) {
        const user = req.user.username;
        Carro
            .sendUserCart(user)
            .then(() => res.redirect('/carritosuccess'));
    } else {
        res.render('login.pug')
    }
}

async function postProd(req, res) {
    logger.info(`ruta '/carrito${req.url}' metodo '${req.method}'`);
    const { id,id_prod } = req.params;
    const { qty } = req.body;
    Carro
        .addProdByCartId(id,id_prod,qty)
        .then(() => res.redirect('/carrito'));
}

async function deleteProd(req, res) {
    logger.info(`ruta '/carrito${req.url}' metodo '${req.method}'`);
    const { id,id_prod } = req.params;
    Carro
        .deleteProdByCartId(id,id_prod)
        .then(() => res.redirect('/carrito'));
}

async function getCarritoMod(req,res) {
    logger.info(`ruta '/carrito${req.url}' metodo '${req.method}'`);
    const user = req.user.username;
    Carro
        .getUserInfo(user)
        .then(() => res.render('carritoMod.pug', { carrito:Carro.carro, usuario:user, id:Carro.id } ));
}

async function carritoSucc(req,res) {
    logger.info(`ruta '/carrito${req.url}' metodo '${req.method}'`);
    const user = req.user.username;
    res.render('carritoSucc.pug', { usuario:user });
}

module.exports = {getCarrito, postCarrito, postProd, deleteProd, getCarritoMod, carritoSucc}