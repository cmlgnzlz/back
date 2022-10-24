const fs = require("fs");
const express = require('express');
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const dotenv = require("dotenv");
require("dotenv").config();
const yargs = require("yargs/yargs")(process.argv.slice(2));
const args = yargs.argv
const { fork } = require("child_process");

const cluster = require("cluster")
const app = express();
const numCPUs = require('os').cpus().length;
const httpServer = {};
if (cluster.isMaster && args["c"]) {
    console.log('MODO CLUSTER ON')

    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('death', function(worker) {
        console.log('worker ' + worker.pid + ' died');
        cluster.fork();
    });

    

} else {
    const httpServer = require("http").createServer(app);
    httpServer.listen(args["p"] || 8080, () => console.log(`Server ON. Escuchando en el puerto ${httpServer.address().port}`));
    
}
const io = require("socket.io")(httpServer);
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

function isValidPassword(user, password) {
    return bcrypt.compareSync(password, user.password);
}

function createHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

mongoose
    .connect(process.env.MONGOADD)
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
    esquemaUser.findById(id, done);
});

app.use(express.json());
app.use('/public', express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({ 
    secret: process.env.SECRETO, 
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
        if (req.isAuthenticated()) {
            const { username, password } = req.user;
            const user = { username, password };
            await productos
                .popular()
                .then(() => res.render('productosRandom.pug', { productos:productos.items, usuario:user } ));;
        } else {
            res.render('login.pug')
        }
    } catch (error) {
        console.log(error)
    }
});

app.get("/info", (req, res) => {
    try {
        if(args["c"]){
            let numCPU=numCPUs;
            res.render('info.pug',{numCPU:numCPU})
        }
        else{
            let numCPU=1;
            res.render('info.pug',{numCPU:numCPU})
        }
    } catch (error) {
        console.log(error)
    }
})

app.get("/api/randoms", (req, res) => {
    let cant = req.query.cant || 100000000
    let randomizar = fork("./func.js", [cant])
    randomizar.send("start")
    randomizar.on("message", (msg) => {
        const { data } = msg;
        res.render('randoms.pug', { randoms:data })
    })
})

app.all("*", (req,res) => {  
    res.json({
        error: -2,
        descripcion: `ruta '${req.url}' metodo '${req.method}' no implementado`
    });
})