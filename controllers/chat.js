const {logger} = require('../config/logger');
const Chat = require('../model/DAOs/chat');
let chat = new Chat();

async function getChat(req, res) {
    logger.info(`ruta '${req.url}' metodo '${req.method}'`);
    if (req.isAuthenticated()) {
        const user = req.user.username;
        chat
            .getChat()
            .then((chat)=> res.render('chat.pug', {usuario:user,chat:chat}))
    } 
    else {
        res.render('login.pug');
    }
};

async function getChatPriv(req, res) {
    logger.info(`ruta '${req.url}' metodo '${req.method}'`);
    if (req.isAuthenticated()) {
        const user = req.user.username;
        const chatId = req.params.id;
        if (user==chatId||user=='admin@admin'){     
            chat
                .getChatPriv(chatId)
                .then((chat)=> res.render('chatPriv.pug', {usuario:user, chat:chat}))
        } else {
            res.redirect('/chat')
        }
    } 
    else {
        res.render('login.pug');
    }
};

async function getChatAdmin(req, res) {
    logger.info(`ruta '${req.url}' metodo '${req.method}'`);
    if (req.isAuthenticated()) {
        const user = req.user.username;
        if (user=='admin@admin'){     
            chat
                .getChatAdmin()
                .then((chat)=> res.render('chatAdmin.pug', {usuario:user, chat:chat}))
        } else {
            res.redirect('/chat')
        }
    } 
    else {
        res.render('login.pug');
    }
};



module.exports = { getChat, getChatPriv, getChatAdmin }