const socket = io();

socket.on("chat", (chat) => {
    let html = [];
    let chatOrden = chat.chat;
    chatOrden.forEach(mensaje => {
        let xat = 
            "<p><span class='mensajeMail'> " + 
            mensaje.email + 
            "</span> [<span class='mensajeStamp'>" + 
            mensaje.fyh +
            "</span>]: <span class='mensajeMsg'>" +
            mensaje.msg +
            "</span></p>";
        html = html + xat
    });
    const cajaId = document.getElementById("cajaMensajes");
    cajaId.innerHTML = html; 
    setTimeout(function (){ 
        cajaId.scrollTop = 0;
      }, 10)    
});

socket.on("chatPriv", (chat) => {
    let html = [];
    let chatOrden = chat.chat;
    chatOrden.forEach(mensaje => {
        let xat = 
            "<p><span class='mensajeMail'> " + 
            mensaje.email + 
            "</span> [<span class='mensajeStamp'>" + 
            mensaje.fyh +
            "</span>]: <span class='mensajeMsg'>" +
            mensaje.msg +
            "</span></p>";
        html = html + xat
    });
    const cajaId = document.getElementById("cajaMensajes");
    cajaId.innerHTML = html; 
    setTimeout(function (){ 
        cajaId.scrollTop = 0;
      }, 10)    
});

function chatear() {
    let msg = document.getElementById("chatMensaje").value;
    let fyh = new Date().toLocaleString();
    let email = document.getElementById("chatId").value; 
    let mensaje = {
        email:email,
        fyh:fyh,
        msg: msg
    }
    if(mensaje.email=="admin@admin"){
        mensaje.tipo = "sistema"
    } else {
        mensaje.tipo = "usuario"
    }
    socket.emit("mensaje", mensaje);
    return false;
};

function chatearPriv() {
    let user = document.getElementById("userChatId").innerText;
    if(user=="admin@admin"){
        let msg = document.getElementById("chatMensaje").value;
        let fyh = new Date().toLocaleString();
        let email = document.getElementById("chatmsgId").value; 
        console.log(email)
        let mensaje = {
            email:email,
            fyh:fyh,
            msg: msg,
            tipo:"sistema"
        }
        socket.emit("mensajepriv", mensaje);
    } else {
        window.alert("No estas autorizado para responder mensajes");
    }
    return false;
};

