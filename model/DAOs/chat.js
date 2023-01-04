const { loggerErr } = require('../../config/logger');
const esquemaChat = require('../models/schemaChat')

class Chat{

    constructor() {
        this.log = [];
    }
    
    async getChat(){
        try {
            const chat = await esquemaChat.find();
            return chat;
        } catch (error) {
            loggerErr.error(error);
        }
    }

    async sendChat(mensaje) {
        try {
            let msgNuevo = new esquemaChat(mensaje)
            await msgNuevo.save()
            let chatNuevo = await esquemaChat.find();
            return chatNuevo;
        } catch (error) {
            loggerErr.error(error);
        }
    }

    async getChatPriv(chatId){
        try {
            const chat = await esquemaChat.find({email:chatId});
            return chat;
        } catch (error) {
            loggerErr.error(error);
        }
    }

    async sendChatPriv(mensaje) {
        try {
            let msgNuevo = new esquemaChat(mensaje)
            await msgNuevo.save()
            let chatId = mensaje.email
            console.log(chatId)
            let chatNuevo = await esquemaChat.find({email:chatId});
            return chatNuevo;
        } catch (error) {
            loggerErr.error(error);
        }
    }
};

module.exports = Chat;