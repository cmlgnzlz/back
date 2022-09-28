const fs = require("fs");
const express = require('express');
const app = express();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);
const { faker } = require("@faker-js/faker");
faker.locale = 'es'

httpServer.listen(process.env.PORT || 8080, () => console.log(`Server ON. Escuchando en el puerto ${httpServer.address().port}`));

const normalizr = require("normalizr");
const schema = normalizr.schema;
const normalize = normalizr.normalize;
const denormalize = normalizr.denormalize;


app.use(express.json());
app.use('/public', express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'pug');
app.set('views', './views');

class Contenedor{

    constructor() {
        this.log = [];
    }
    async getChat(){
        try {
            let chat = await fs.promises.readFile("chat.txt","utf-8");
            let chatJson = JSON.parse(chat)
            const author = new schema.Entity("authors",{},{ idAttribute: 'id' });
            const message = new schema.Entity("messages", { author: author },{ idAttribute: 'stamp' });
            const chats = new schema.Entity("chats", { chat: [message] });
            const chatNormalized = normalize(chatJson, chats);
            return chatNormalized;
        } catch (error) {
            console.log(error);
        }

    }

    async sendChat(mensaje) {
        try {
            let chateo = await fs.promises.readFile("chat.txt","utf-8");
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
            console.log(chateoFS)
            fs.promises.writeFile("chat.txt",chateoFS);
            return chatNormalized;
      } catch (error) {
          console.log(error);
      }
    }
};

class Generador{

    constructor() {
        this.items = [];
    }

    async popular(cant = 5) {
        this.items = [];
        const nuevos = [];
        for (let i = 0; i < cant; i++) {
            const nuevoProducto = await this.generarProducto(i+1);
            const guardado = this.guardar(nuevoProducto);
            nuevos.push(guardado);
        }
        return this.items;
    }

    async generarProducto(id) {
        return {
            id,
            name: faker.lorem.word(),
            img: faker.image.fashion(320,240,true),
            price: faker.commerce.price(500,5000,0), 
        }
    }
    async guardar(nuevoUsuario) {
        this.items.push(nuevoUsuario);
    }
}

const chat = new Contenedor();
const productos = new Generador();


app.get("/", (req,res) => {  
    res.render('index.pug')
});

app.get("/api/productos-test/", async (req,res) => {  
    try {
        await productos
        .popular()
        .then(() => res.render('productos.pug', { productos:productos.items } ));;
    } catch (error) {
        console.log(first)
    }
});

io.on('connect', socket => {
    console.log('Usuario conectado ' + socket.id);

    socket.on('logOn', () => {
        chat
        .getChat()
        .then((chatNormalized) => io.sockets.emit('chat', { chat:chatNormalized } ));
    })

    socket.on('mensaje', (mensaje) => {
        chat
        .sendChat(mensaje)
        .then((chatNormalized) => io.sockets.emit('chat', { chat:chatNormalized } ));
    })
})


