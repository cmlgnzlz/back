const fs = require("fs");
const normalizr = require("normalizr");
const schema = normalizr.schema;
const normalize = normalizr.normalize;
const denormalize = normalizr.denormalize;
const { loggerErr } = require('../../config/logger');

class Chat{

    constructor() {
        this.log = [];
    }
    
    async getChat(){
        try {
            let chat = await fs.promises.readFile("api/chat.txt","utf-8");
            let chatJson = JSON.parse(chat)
            const author = new schema.Entity("authors",{},{ idAttribute: 'id' });
            const message = new schema.Entity("messages", { author: author },{ idAttribute: 'stamp' });
            const chats = new schema.Entity("chats", { chat: [message] });
            const chatNormalized = normalize(chatJson, chats);
            return chatNormalized;
        } catch (error) {
            loggerErr.error(error);
        }
    }

    async sendChat(mensaje) {
        try {
            let chateo = await fs.promises.readFile("api/chat.txt","utf-8");
            let chateoJson = JSON.parse(chateo);
            const author = new schema.Entity('authors',{},{ idAttribute: 'id' });
            const message = new schema.Entity('messages', { author: author }, {idAttribute: 'stamp'});
            const chats = new schema.Entity('chats', {  chat: [message] });
            await chateoJson['chat'].push(mensaje);
            const chatNormalized = await normalize(chateoJson, chats);
            const denormalizedChat = denormalize(
                chatNormalized.result,
                chats,
                chatNormalized.entities,
            );
            let chateoFS = JSON.stringify(denormalizedChat)
            fs.promises.writeFile("api/chat.txt",chateoFS);
            return chatNormalized;
        } catch (error) {
            loggerErr.error(error);
        }
    }
};

module.exports = Chat;