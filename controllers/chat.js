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
        const chatId = req.params.id
        chat
            .getChatPriv(chatId)
            .then((chat)=> res.render('chatPriv.pug', {usuario:user, chat:chat}))
    } 
    else {
        res.render('login.pug');
    }
};

module.exports = { getChat, getChatPriv }