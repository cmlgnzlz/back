const express = require('express');
const app = express();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);

const { optionsMDB } = require("./options/optionsMDB");
const { optionsSQLite } = require("./options/optionsSQLite");
const knexMDB = require("knex")(optionsMDB);
const knexSQLite = require("knex")(optionsSQLite);

httpServer.listen(process.env.PORT || 8080, () => console.log(`Server ON. Escuchando en el puerto ${httpServer.address().port}`));

app.use(express.json());
app.use('/public', express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'pug');
app.set('views', './views');

class Contenedor{

  constructor() {
      this.datos = [];
      this.byId = {};
      this.log = [];
  }

  async getAll(){
        let datos = await knexMDB("productos")
            .select("*")
            .catch((err)=>console.log(err));
        let chat = await knexSQLite("mensajes")
            .select("*")
            .catch((err)=>console.log(err));
        this.datos = datos;
        this.log = chat;
  }

  async save(product) {
        let datos = await knexMDB("productos")
            .insert(product)
            .catch((err)=>console.log(err));
        this.byId = product;
  }

  async saveChat(mensaje) {
        const chat = await knexSQLite("mensajes")
            .insert(mensaje)
            .catch((err)=>console.log(err));
        this.log = chat;
  }
};

const producto = new Contenedor();

app.get("/", (req,res) => {  
    producto
    .getAll()
    .then(() => res.render('index.pug', { productos: producto.datos , chatLog: producto.log } ))
});

io.on('connect', socket => {
    console.log('Usuario conectado ' + socket.id);

    socket.on('productoNuevo', datos => {
        producto
        .save(datos)
        .then(() => io.sockets.emit('productoAgrega', producto.byId));
    })

    socket.on('mensaje', (mensaje) => {
        producto.
        saveChat(mensaje).
        then(() => io.sockets.emit('chateo', mensaje ));
    })
})