const socket = io();
const schema = normalizr.schema;
const denormalize = normalizr.denormalize;

socket.on("connect", () => {
    socket.emit("logOn");
    setTimeout(function (){
        document.getElementById("cajaMensajes").scrollTop = 999999999
      }, 10)
});

socket.on("chat", (chat) => {
    let html = [];
    const normalizedChat = chat.chat;
    const author = new schema.Entity('authors',{},{ idAttribute: 'mail' });
    const message = new schema.Entity('messages', { author: author });
    const chats = new schema.Entity('chats', {  chat: [message] });
    const denormalizedChat = denormalize(
        normalizedChat.result,
        chats,
        normalizedChat.entities,
    );
    let compression = (JSON.stringify(chat).length / JSON.stringify(denormalizedChat).length)*100;
    document.getElementById("cajaCompresion").innerText = `El porcentaje de compresion es ${compression.toString().slice(0, 5)}%`;
    const chatLog = denormalizedChat.chat;
    chatLog.forEach(mensaje => {
        let xat = 
            "<p><span class='mensajeMail'> " + 
            mensaje.id + 
            "</span> [<span class='mensajeStamp'>" + 
            mensaje.stamp +
            "</span>]: <span class='mensajeMsg'>" +
            mensaje.text +
            "</span></p>";
        html = xat + html
    });
    const cajaId = document.getElementById("cajaMensajes");
    cajaId.innerHTML = html; 
    setTimeout(function (){ 
        cajaId.scrollTop = 0;
      }, 10)    
});

function chatear() {
    const msg = document.getElementById("chatMensaje").value;
    const stamp = new Date().toLocaleString();
    const author = {
        id:mail,
        nombre:nomb,
        apellido:apel,
        edad:edad,
        alias:alias,
        avatar:avat,
    }
    const mensaje = {
        id:mail,
        author: author,
        text: msg,
        stamp:stamp
    }
    socket.emit("mensaje", mensaje);
    return false;
};