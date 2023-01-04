const { loggerErr } = require('../../config/logger');
const esquemaChat = require('../models/schemaChat')

class Chat{

    constructor() {
        this.log = [];
    }
    
    async getChat(){
        try {
            const chat = await esquemaChat.find({tipo:'usuario'});
            return chat;
        } catch (error) {
            loggerErr.error(error);
        }
    }

    async sendChat(mensaje) {
        try {
            let msgNuevo = new esquemaChat(mensaje)
            await msgNuevo.save()
            let chatNuevo = this.getChat();
            return chatNuevo;
        } catch (error) {
            loggerErr.error(error);
        }
    }

    async getChatPriv(chatId){
        try {
            const chat = await esquemaChat.find({email:chatId,tipo:'usuario'});
            return chat;
        } catch (error) {
            loggerErr.error(error);
        }
    }

    async getChatAdmin(){
        try {
            const chat = await esquemaChat.find({tipo:'usuario'});
            let emails = [];
            const usuarios = chat.forEach((value) => {
                emails.push(value.email);
            })
            const usuariosClean = [...new Set(emails)];
            return usuariosClean;
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
            let chatNuevo = await esquemaChat.find({email:chatId,tipo:'usuario'});
            return chatNuevo;
        } catch (error) {
            loggerErr.error(error);
        }
    }
};

module.exports = Chat;