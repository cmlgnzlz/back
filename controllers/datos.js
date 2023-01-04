const { logger } = require('../config/logger');
const Carrito = require('../model/DAOs/carro');
const Producto = require('../api/productos');
let producto = new Producto()
let Carro = new Carrito()

async function getLogin(req,res) {
    logger.info(`ruta '/login${req.url}' metodo '${req.method}'`);
    res.redirect('/productos')
};

async function postSignup(req,res) {
    logger.info(`ruta '/login${req.url}' metodo '${req.method}'`);
    const userData = req.body;
    Carro
        .saveNewCart(userData)
        .then(() => res.redirect('/'));
};

async function getSignup(req, res) {
    logger.info(`ruta '/login${req.url}' metodo '${req.method}'`);
    res.render('signup.pug')
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

module.exports = {getLogin, postSignup, getSignup, failSignup, failLogin, getLogout }