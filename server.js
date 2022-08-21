const fs = require("fs");
const express = require('express');
const app = express();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);

httpServer.listen(process.env.PORT || 8080, () => console.log("SERVER ON"));

app.use(express.json());
app.use('/public', express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'pug');
app.set('views', './views');

class Contenedor{

  constructor(nombreArchivo) {
      this.nombreArchivo = nombreArchivo;
      this.datos = [];
      this.byId = {};
      this.log = [];
  }

  async getAll(){
      try {
          let datos = await fs.promises.readFile(this.nombreArchivo,"utf-8");
          let datosJson = await JSON.parse(datos);
          this.datos = datosJson;
          let datosChat = await fs.promises.readFile("chat.txt","utf-8");
          let chatJson = await JSON.parse(datosChat);
          this.log = chatJson;
      } catch (error) {
          console.log(error);
      }
  }

  async save(product) {
      try {
          let datos = await fs.promises.readFile(this.nombreArchivo,"utf-8");
          let datosJson = await JSON.parse(datos);
          if (datosJson.length>0){
              let maxId = datosJson.map(i=>i.id).sort((a, b) => {if(a == b) {return 0;}if(a < b) {return -1;}return 1;}).splice(-1);
              let nuevoId = parseInt(maxId)+1;
              product = {id:nuevoId, ...product}
              datosJson.push(product);
              this.byId = product;
              this.datos = datosJson;
              fs.promises.writeFile(this.nombreArchivo, JSON.stringify(datosJson, null, 1));
          }
          else{
              this.datos = { error : 'producto no encontrado' };
          }
      } catch (error) {
          console.log(error);
      }
  }

  async saveChat(mensaje) {
      try {
            let chateo = await fs.promises.readFile("chat.txt","utf-8");
            let chateoJson = await JSON.parse(chateo);
            chateoJson.push(mensaje);
            this.log = chateoJson;
            fs.promises.writeFile("chat.txt", JSON.stringify(this.log, null, 1));
      } catch (error) {
          console.log(error);
      }
  }
};

const producto = new Contenedor("productos.txt");

app.get("/", (req,res) => {  
    producto.getAll().then(() => res.render('index.pug', { productos: producto.datos , chatLog: producto.log} ));
});

io.on('connect', socket => {
    console.log('Usuario conectado ' + socket.id);

    socket.on('productoNuevo', datos => {
        producto.
        save(datos).
        then(() => io.sockets.emit('productoAgrega', producto.byId));
    })

    socket.on('mensaje', (mensaje) => {
        producto.
        saveChat(mensaje).
        then(() => io.sockets.emit('chateo', mensaje ));
    })
})