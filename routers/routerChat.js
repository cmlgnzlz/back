const Router = require('express'); 
const {getChat, getChatPriv, getChatAdmin} = require("../controllers/chat");
const routerChat = new Router();

routerChat.get("/", getChat);
routerChat.get("/admin@admin", getChatAdmin);
routerChat.get("/:id", getChatPriv);
module.exports = routerChat