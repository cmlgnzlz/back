const fs = require("fs");
const express = require('express');
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const app = express();
const httpServer = require("http").createServer(app);
httpServer.listen(process.env.PORT || 8080, () => console.log(`Server ON. Escuchando en el puerto ${httpServer.address().port}`));

const io = require("socket.io")(httpServer);
const MongoStore = require("connect-mongo");
const mongoose = require('mongoose')
const bcrypt = require("bcrypt");
const { faker } = require("@faker-js/faker");
faker.locale = 'es'

const normalizr = require("normalizr");
const schema = normalizr.schema;
const normalize = normalizr.normalize;
const denormalize = normalizr.denormalize;

const esquemaProd = require('./models/schemaProd');
const esquemaUser = require('./models/schemaUser');

/* const redis = require("redis");
const client = redis.createClient({
    legacyMode: true,
});
client.connect();
const RedisStore = require("connect-redis")(session); */

function isValidPassword(user, password) {
    return bcrypt.compareSync(password, user.password);
}

function createHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

mongoose
    .connect("mongodb+srv://cmlgnzlz:hzbKy1lTYIaO1Ljm@cluster0.a2hirij.mongodb.net/test?retryWrites=true&w=majority")
    .then(() => console.log("Connected to DB"))
    .catch((e) => {
        console.error(e);
        throw "ERROR CONECTANDO A LA DB";
    });
   
passport.use(
    "login",
    new LocalStrategy((username, password, done) => {
        esquemaUser.findOne({ username }, (err, user) => {
            if (err) return done(err);
            if (!user) {
                return done(null, false);
            }
            if (!isValidPassword(user, password)) {
                return done(null, false);
            }
            return done(null, user);
        });
    })
);

passport.use(
    "signup",
    new LocalStrategy(
        {
            passReqToCallback: true,
        },
        (req, username, password, done) => {
            esquemaUser.findOne({ username: username }, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (user) {
                    return done(null, false);
                }
                const newUser = {
                    username: username,
                    password: createHash(password),
                };
                esquemaUser.create(newUser, (err, user) => {
                    if (err) {
                        return done(err);
                    }
                    return done(null, user);
                });
            });
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    console.log(id)
    esquemaUser.findById(id, done);
});

app.use(express.json());
app.use('/public', express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
/* app.use(
    session({
        store: new RedisStore({ host: "localhost", port: 6379, client, ttl: 300 }),
            secret: "secretisimo",
            cookie: {
                httpOnly: false,
                secure: false,
                maxAge: 600000, // 1 dia CAMBIAR POR 10 MIN
            },
            rolling: true,
            resave: true,
            saveUninitialized: false,
    })
); */
app.use(session({ 
    secret: 'secretisimo', 
    cookie: {
        httpOnly: false,
        secure: false,
        maxAge: 600000,
    },
    rolling: true,
    resave: true,
    saveUninitialized: false,   
}));
app.use(passport.initialize());
app.use(passport.session());

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

class Producto{

    constructor() {
        this.datos = [];
        this.user = {};
    }

    async getAll(user){
        try {
            let datos = await esquemaProd.find();
            this.datos = datos;
            this.user = user
        } catch (error) {
            console.log(error);
        }
    }
};

const chat = new Contenedor();
const productos = new Generador();
const producto = new Producto();

app.get("/", (req,res) => {
    if (req.isAuthenticated()) {
        res.redirect('/login')
    } 
    else {
        res.render('login.pug')
    }
});

app.post("/login", passport.authenticate("login", { failureRedirect: "/failogin" }), (req,res) => {
    const { username, password } = req.user;
    const user = { username, password };
    producto
        .getAll()
        .then(() => res.render('index.pug', {productos:producto.datos, usuario:user}))
})

function auth(req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } 
    else {
        res.redirect("/")
    }
}

app.get("/login", auth, (req, res) => {
    const { username, password } = req.user;
    const user = { username, password };
    producto
        .getAll()
        .then(() => res.render('index.pug', {productos:producto.datos, usuario:user}))
})

app.post("/signup", passport.authenticate("signup", { failureRedirect: "/failsignup" }), (req,res) => {
    res.redirect('/login')
})

app.get("/signup", (req, res) => {
    res.render('signup.pug')
})

app.get("/failsignup", (req, res) => {
    res.render('failsignup.pug')
 })

app.get("/failogin", (req, res) => {
   res.render('failogin.pug')
})

app.get("/logout", (req, res) => {
    if (req.isAuthenticated()) {
        const { username, password } = req.user;
        const user = { username, password };
        req.logout()
        res.render('logout.pug', {usuario:user})
    } 
    else {
        res.render('login.pug')
    }
});

io.on('connect', (socket) => {
    console.log('Usuario conectado ' + socket.id);

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

app.get("/api/productos-test/", async (req,res) => {  
    try {
        await productos
        .popular()
        .then(() => res.render('productosRandom.pug', { productos:productos.items } ));;
    } catch (error) {
        console.log(error)
    }
});

app.all("*", (req,res) => {  
    res.json({
        error: -2,
        descripcion: `ruta '${req.url}' metodo '${req.method}' no implementado`
    });
})
