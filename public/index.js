const socket = io();

socket.on("connect", () => {
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

socket.on("productoActualiza", (tabla) => {
    let header = '<tbody><tr><th>ID</th><th>Nombre</th><th>Precio</th><th>Stock</th><th>Img</th></tr></tbody><tbody>';
    let htmlTabla =
        tabla.map(function (producto) {
            return "<tr> <td class='text'>" + 
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
        }).join('');
    let footer = '</tbody>';
    let html = header + htmlTabla + footer;
    document.getElementById("tabla").innerHTML = html;
})

socket.on("productoBorra", (tabla) => {
    let header = '<tbody><tr><th>ID</th><th>Nombre</th><th>Precio</th><th>Stock</th><th>Img</th></tr></tbody><tbody>';
    let htmlTabla =
        tabla.map(function (producto) {
            return "<tr> <td class='text'>" + 
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
        }).join('');
    let footer = '</tbody>';
    let html = header + htmlTabla + footer;
    document.getElementById("tabla").innerHTML = html;})

function enviar() {
    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const qty = document.getElementById("qty").value;
    const img = document.getElementById("img").value;
    socket.emit("productoNuevo",{name:name,price:price,qty:qty,img:img});
    return false;
};