const { logger } = require('../config/logger');
const Carrito = require('../model/DAOs/carro');
const Producto = require('../api/productos');
let producto = new Producto()
let Carro = new Carrito()

async function getProd(req, res) {
    logger.info(`ruta '/productos${req.url}' metodo '${req.method}'`);
    const user = req.user.username;
    const productos = [];
    productos.datos = await producto.getProds();
    const userdata = await Carro.getUserInfo(user);
    productos.userdata = userdata.userdata;
    res.render('index.pug', {productos:productos.datos, usuario: user, userdata:productos.userdata});
}

async function getProdById(req, res) {
    logger.info(`ruta '/productos${req.url}' metodo '${req.method}'`);
    const { id } = req.params;
    producto
        .getById(id)
        .then(() => res.json(producto.productos.byId));
}

async function getProdbyCat(req, res) {
    logger.info(`ruta '/productos${req.url}' metodo '${req.method}'`);
    const user = req.user.username;
    const {cat} = req.params
    const productos = [];
    productos.datos = await producto.getProdbyCat(cat);
    const userdata = await Carro.getUserInfo(user);
    productos.userdata = userdata.userdata;
    res.render('index.pug', {productos:productos.datos, usuario: user, userdata:productos.userdata});
}

async function postProd(req, res) {
    logger.info(`ruta '/productos${req.url}' metodo '${req.method}'`);
    const product = req.body;
    producto
        .save(product)
        .then(() => res.json(producto.productos.byId));
}

async function putProd(req, res) {
    logger.info(`ruta '/productos${req.url}' metodo '${req.method}'`);
    const { id } = req.params
    const body = req.body;
    producto
        .updateById(id,body)
        .then(() => res.json(producto.productos.byId));
}
async function deleteProd(req,res) {
    const { id } = req.params;
    producto
        .deleteById(id)
        .then(() => res.json(producto.productos.datos))
}



module.exports = { getProd, getProdById, postProd, putProd, deleteProd, getProdbyCat };