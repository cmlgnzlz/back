const socket = io();

socket.on("connect", () => {
    setTimeout(function (){ 
        document.getElementById("cajaMensajes").scrollTop = 999999999
      }, 10)
});

socket.on("productoAgrega", (producto) => {
    const html = 
        "<tr> <td class='text'>" + 
        producto.id + 
        "</td> <td class='text'>" +
        producto.name +
        "</td> <td class='text'>" +
        producto.price + 
        "</td> <td class='text'>" +
        producto.qty + 
        "</td> <td class='img'> <img src=" +
        producto.img +  
        "></td></tr>";
    document.getElementById("tabla").innerHTML = document.getElementById("tabla").innerHTML + html;
})

socket.on("chateo", (mensaje) => {
    const htmlChat = 
        "<p><span class='mensajeMail'> " + 
        mensaje.mail + 
        "</span> [<span class='mensajeStamp'>" + 
        mensaje.stamp +
        "</span>]: <span class='mensajeMsg'>" +
        mensaje.msg +
        "</span></p>";
    const cajaId = document.getElementById("cajaMensajes")
    cajaId.innerHTML = cajaId.innerHTML + htmlChat ;
    setTimeout(function (){ 
        cajaId.scrollTop = 999999999;
      }, 10)
})

function enviar() {
    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const qty = document.getElementById("qty").value;
    const img = document.getElementById("img").value;
    socket.emit("productoNuevo",{name:name,price:price,qty:qty,img:img});
    return false;
};

function chatear() {
    const mail = document.getElementById("chatMail").value;
    const msg = document.getElementById("chatMensaje").value;
    const stamp= new Date().toLocaleString();
    socket.emit("mensaje",{mail:mail,msg:msg,stamp:stamp});
    return false;
};