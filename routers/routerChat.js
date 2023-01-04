const Router = require('express'); 
const {getChat, getChatPriv} = require("../controllers/chat");
const routerChat = new Router();

routerChat.get("/", getChat)
routerChat.get("/:id", getChatPriv)

module.exports = routerChat