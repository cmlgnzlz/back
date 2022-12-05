const {logger} = require('../config/logger');
const Carrito = require('../model/DAOs/carro');
const Producto = require('../model/DAOs/productos');
let producto = new Producto()
let Carro = new Carrito()

async function getLogin(req,res) {
    logger.info(`ruta '/login${req.url}' metodo '${req.method}'`);
    const carrId = req.user.carrito;
    const user = req.user.username;
    const productos = await producto.getProds();
    const userdata = await Carro.getUserInfo(carrId);
    productos.userdata = userdata.userdata;
    res.render('index.pug', {productos:productos.datos, usuario: user, userdata:productos.userdata});
};

async function postSignup(req,res) {
    logger.info(`ruta '/login${req.url}' metodo '${req.method}'`);
    const userData = req.body;
    Carro
        .saveNewCart(userData)
        .then(() => res.redirect('/login/subidor'));
};

async function getSignup(req, res) {
    logger.info(`ruta '/login${req.url}' metodo '${req.method}'`);
    Carro
        .newCart()
        .then(() => res.render('signup.pug', {carro:Carro.carro}));
};

async function failSignup(req, res) {
    logger.info(`ruta '/login${req.url}' metodo '${req.method}'`);
    res.render('failsignup.pug');
};

async function failLogin(req, res) {
    logger.info(`ruta '/login${req.url}' metodo '${req.method}'`);
    res.render('failogin.pug');
};

async function getLogout(req, res) {
    logger.info(`ruta '/login${req.url}' metodo '${req.method}'`);
    if (req.isAuthenticated()) {
        const { username, password } = req.user;
        const user = { username, password };
        req.logout();
        res.render('logout.pug', {usuario:user});
    } 
    else {
        res.render('login.pug');
    }
};

async function subidor(req, res) {
    if(req.user){
        let id = req.user.carrito;
        let aPath = req.file.path;
        Carro
            .saveAvatar(id,aPath)
            .then(() => res.redirect('/'));
    } else {
        res.render('login.pug');
    }
};

async function getProd(req, res) {
    logger.info(`ruta '/api/productos${req.url}' metodo '${req.method}'`);
    producto
        .getProds()
        .then(() => res.json(producto.datos));
}

async function getProdById(req, res) {
    logger.info(`ruta '/api/productos${req.url}' metodo '${req.method}'`);
    const { id } = req.params;
    producto
        .getById(id)
        .then(() => res.json(producto.byId));
}
async function postProd(req, res) {
    logger.info(`ruta '/api/productos${req.url}' metodo '${req.method}'`);
    const product = req.body;
    producto
        .save(product)
        .then(() => res.json(producto.byId));
}

async function putProd(req, res) {
    logger.info(`ruta '/api/productos${req.url}' metodo '${req.method}'`);
    const { id } = req.params
    const body = req.body;
    producto
        .updateById(id,body)
        .then(() => res.json(producto.byId));
}
async function deleteProd(req,res) {
    const { id } = req.params;
    producto
        .deleteById(id)
        .then(() => res.json(producto.datos))
}



module.exports = {getLogin, postSignup, getSignup, failSignup, failLogin, getLogout, subidor, getProd, getProdById, postProd, putProd, deleteProd};