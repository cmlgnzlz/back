const fs = require("fs");
const express = require('express');
const session = require("express-session");
const app = express();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);
const MongoStore = require("connect-mongo");
const mongoose = require('mongoose')
const { faker } = require("@faker-js/faker");
faker.locale = 'es'

httpServer.listen(process.env.PORT || 8080, () => console.log(`Server ON. Escuchando en el puerto ${httpServer.address().port}`));

const normalizr = require("normalizr");
const schema = normalizr.schema;
const normalize = normalizr.normalize;
const denormalize = normalizr.denormalize;

const esquemaProd = require('./models/schemaProd')

app.use(express.json());
app.use('/public', express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'pug');
app.set('views', './views');
app.use(
    session({
        store: MongoStore.create({
        mongoUrl: "mongodb+srv://cmlgnzlz:hzbKy1lTYIaO1Ljm@cluster0.a2hirij.mongodb.net/?retryWrites=true&w=majority",
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        }),
        secret: "un misterio",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 600000, // cookie dura de 10 min
            expires: 60000, // expira luego de 1 min de inactividad
        },
        autoRemove: 'native' //remueve sesiones expiradas
    })
);

app.use(function(req,res,next){  //middleware que actualiza el tiempo de expiracion 
    req.session._garbage = Date();
    req.session.touch();
    next()
})

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

class Producto{

    constructor() {
        this.datos = [];
        this.user = {};
    }

    async connectMDB() {
        try {
            const URL = "mongodb+srv://cmlgnzlz:hzbKy1lTYIaO1Ljm@cluster0.a2hirij.mongodb.net/test?retryWrites=true&w=majority"
            let rta = await mongoose.connect(URL, {
                useNewUrlParser: true,
                useUniFiedTopology: true
            })
        } catch (e) {
            console.log(e)
        }   
    }

    async getAll(user){
        try {
            await this.connectMDB();
            let datos = await esquemaProd.find();
            this.datos = datos;
            this.user = user
            mongoose.disconnect();
        } catch (error) {
            console.log(error);
        }
    }
};

const chat = new Contenedor();
const productos = new Generador();
const producto = new Producto();


app.get("/", (req,res) => {
    if(req.session.user==null){
        res.render('login.pug')
    } else {
        res.redirect('/login')
    }  
});

app.post("/login", (req,res) => {
    const usuario = req.body;
    req.session.user = usuario;
    req.session.admin = true;
    res.redirect('/login')
})

function auth(req, res, next) {
    if (!req.session.admin) return res.status(403).render('login.pug');
    return next();
}

app.get("/login", auth, (req, res) => {
    const user = req.session.user
    producto
        .getAll(user)
        .then(() => res.render('index.pug', {productos:producto.datos, usuario:producto.user}))
})

app.get("/logout", (req, res, next) => {
    if(req.session.user==null){
        res.render('login.pug')
    } else {
        const user = req.session.user;
        req.session.destroy(() => {
            res.render('logout.pug', {usuario:user})}
        )
    }
    req.setTimeout(1000, function(){
        res.redirect("/")
    })
});

io.on('connect', (socket) => {
    console.log('Usuario conectado ' + socket.id);
    //const req = socket.request
    socket.on('productos', () => {
        producto
        .getAll()
        .then((producto) => io.sockets.emit(producto))
    })

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

app.all("*", (req,res) => {  
    res.json({
        error: -2,
        descripcion: `ruta '${req.url}' metodo '${req.method}' no implementado`
    });
})

app.get("/api/productos-test/", async (req,res) => {  
    try {
        await productos
        .popular()
        .then(() => res.render('productosRandom.pug', { productos:productos.items } ));;
    } catch (error) {
        console.log(error)
    }
});
