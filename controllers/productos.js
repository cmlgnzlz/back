const {logger} = require('../config/logger');
const Carrito = require('../service/carro');
const Producto = require('../service/productos');

let producto = new Producto();
let Carro = new Carrito();

async function getLogin(req,res) {
    logger.info(`ruta '/login${req.url}' metodo '${req.method}'`);
    const carrId = req.user.carrito;
    const user = req.user.username;
    producto
        .getAll(carrId)
        .then(() => res.render('index.pug', {productos:producto.datos, usuario: user, userdata:producto.userdata}));
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

module.exports = {getLogin, postSignup, getSignup, failSignup, failLogin, getLogout, subidor};