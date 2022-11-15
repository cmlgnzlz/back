const fs = require("fs");
const express = require('express');
const session = require("express-session");
const compression = require('compression')
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const dotenv = require("dotenv");
require("dotenv").config();
const PORT = process.env.PORT || 5000
const log4js = require('log4js');
const app = express();

const httpServer = require("http").createServer(app);
httpServer.listen(PORT, () => console.log(`Server ON. Escuchando en el puerto ${httpServer.address().port}`));

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

const admin = require("firebase-admin");
const serviceAccount = require("./bd/fireback-addcb-firebase-adminsdk-w2tqk-52c47a4269.json");

app.use(compression())

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
                    carrito: req.body.carroId
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

passport.deserializeUser((username, done) => {
    esquemaUser.findById(username, done);
});

app.use(express.json());
app.use('/public', express.static(__dirname + "/public"));
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));
app.enable('trust proxy'); 
app.use(require('cookie-session')({ 
    secret: process.env.SECRETO, 
    cookie: {
        httpOnly: false,
        secure: (process.env.NODE_ENV && process.env.NODE_ENV == 'production') ? true:false,
        maxAge: 600000,
    },
    resave: true,
    saveUninitialized: true,
    proxy: true,    
}));

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'pug');
app.set('views', './views');

const multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage })

const nodemailer = require("nodemailer")
const adminEth = 'margaretta.oconnell38@ethereal.email'
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: adminEth,
        pass: process.env.ETHEREAL
    }
});

const twilio = require("twilio");
const accountSid =  'AC944b2ed8bb6d2d149139ecacffdc0d48';
const authToken = process.env.TWILIO;
const client = twilio(accountSid, authToken);

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
            loggerErr.error(error);
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
            fs.promises.writeFile("chat.txt",chateoFS);
            return chatNormalized;
        } catch (error) {
            loggerErr.error(error);
        }
    }
};

class Producto{

    constructor() {
        this.datos = [];
        this.userdata = {};
        this.byId = {};
    }

    async getAll(carrId){
        try {
            let datos = await esquemaProd.find();
            let userData = await Carro.getUserInfo(carrId);
            this.datos = datos;
            this.userdata = userData.userdata;
            return this
        } catch (error) {
            loggerErr.error(error);
        }
    }

    async getById(id) {
        try {
            let datos = await esquemaProd.find({id}).lean()
            if(datos.find(i=>i.id == id)){
                let productoArr = datos.find(obj => {
                    return obj
                })
                this.byId.id = productoArr.id;
                this.byId.name = productoArr.name;
                this.byId.price = productoArr.price;
                this.byId.img = productoArr.img;
                this.byId.qty = 1;
            } else{
                return
            }
            return this.byId;
        } catch (error) {
            loggerErr.error(error);
        }
    }

};

class Carrito{

    constructor() {
        this.carro = {};
        this.userdata = {};
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
          });
    }

    async newCart() {
        try {
            let db = admin.firestore();
            let query = db.collection('carritos');
            let snapshot = await query.get();
            let cuenta = snapshot.size;
            let id = cuenta+1;
            let productos = [];
            let carro = {id:id,productos:productos};
            this.carro = carro;
        } catch (error) {
            loggerErr.error(error);
        }  
    }

    async saveNewCart(userData) { 
        try {
            let db = admin.firestore();
            let query = db.collection('carritos');
            let id = userData.carroId;
            let data = {};
            data.username = userData.username
            data.nombre = userData.nombre;
            data.edad = userData.edad;
            data.telefono = userData.telefono;
            data.direccion = userData.direccion;
            let productos = [];
            let carro = {id:id,data:data,productos:productos};
            let doc = query.doc(`${id}`);
            let carroVa = await doc.create(carro);
            this.carro = carro;
            const mailOptions = {
                from: 'Servidor Node',
                to: adminEth,
                subject: 'Nuevo registro en servidor',
                html: `<div><p style="color: blue;font-size:2rem">Nuevo registro de:</p><p style="color: red;font-size:1.4rem">correo:${data.username}</p><p style="color: red;font-size:1.4rem">nombre:${data.nombre}</p><p style="color: red;font-size:1.4rem">direccion:${data.direccion}</p><p style="color: red;font-size:1.4rem">edad:${data.edad}</p><p style="color: red;font-size:1.4rem">telefono:${data.telefono}</p><p style="color: red;font-size:1.4rem">carrito:${id}</p></div>`
             }
             const info = await transporter.sendMail(mailOptions)
        } catch (error) {
            loggerErr.error(error);
        }
    }

    async saveAvatar(id,aPath){
        try {
            let db = admin.firestore();
            let query = db.collection('carritos');
            let doc = query.doc(String(id));
            const item = await doc.update({
                avatar: admin.firestore.FieldValue.arrayUnion(aPath)
            });
        } catch (error) {
            loggerErr.error(error);
        }
    }

    async deleteCartById(id) {
        try {
            let db = admin.firestore();
            let verBorrar = await db.collection('carritos').doc(id).get();
            this.carro = verBorrar.data();
            let borrar = await db.collection('carritos').doc(id).delete();
        } catch (error) {
            loggerErr.error(error);
        }
    }
    
    async getByCartId(id){
        try {
            let db = admin.firestore();
            let query = db.collection('carritos');
            let doc = query.doc(id);
            let carro = await doc.get();
            let carroData = carro.data();
            this.carro = carroData
        } catch (error) {
            loggerErr.error(error);
        }
    }

    async getUserInfo(id){
        try {
            let db = admin.firestore();
            let query = db.collection('carritos');
            let doc = query.doc(String(id));
            let carro = await doc.get();
            let carroData = carro.data();
            this.carro = carroData.productos;
            this.userdata = carroData.data;
            let userAvat = carroData.avatar;
            let avatArr = userAvat.find(obj => {
                return obj
            });
            let avatString =`\\${avatArr}`;
            this.userdata.avatar = avatString;
            this.userdata.id = id;
            return this
        } catch (error) {
            loggerErr.error(error);
        }
    }

    async sendUserCart(id) {
        try {
            let db = admin.firestore();
            let query = db.collection('carritos');
            let doc = query.doc(String(id));
            let carro = await doc.get();
            let carroData = carro.data();
            this.carro = carroData.productos;
            this.userdata = carroData.data;
            this.userdata.id = id;
            let html = "<p style='color: blue;font-size:2rem'><a>Nuevo pedido de: " + this.userdata.username + "</p><p style='color: blue;font-size:1.6rem'><a>Id de carrito: " + this.userdata.id + "</a></p>"
            const carroHtml = this.carro;
            carroHtml.forEach(producto => {
                let carroProd = 
                    "<p style='font-size:1.4rem'><a style='color: green;'>Nombre: " + 
                    producto.name + 
                    "</a> <a style='color: blue;'>Precio: $" + 
                    producto.price +
                    "</a> <a  style='color: red;'>Cantidad: " +
                    producto.qty +
                    "</a></p>";
                html = html + carroProd
            });
            const mailOptions = {
                from: 'Servidor Node',
                to: adminEth,
                subject: 'Nueva compra en servidor',
                html: html
             }
             const carroFono = "whatsapp:+"+this.userdata.telefono;
             const info = await transporter.sendMail(mailOptions)
             let whapp = "Nuevo pedido de: " + this.userdata.username + "\n"
             carroHtml.forEach(producto => {
                let carroProd = 
                    "Nombre: " + 
                    producto.name + 
                    "\nPrecio: $" + 
                    producto.price +
                    "\nCantidad: " +
                    producto.qty +
                    "\n\n";
                whapp = whapp + carroProd
            });
             const message = await client.messages.create({
                body: whapp,
                from: 'whatsapp:+14155238886',
                to: carroFono
             }) 
        } catch (error) {
            loggerErr.error(error);
        }        
    }
    async addProdByCartId(id,id_prod) {
        const producto = new Producto();
        try {
            let db = admin.firestore();
            let query = db.collection('carritos');
            let doc = query.doc(String(id));
            let productoAdd = await producto.getById(id_prod);
            const item = await doc.update({
                productos: admin.firestore.FieldValue.arrayUnion(productoAdd)
            });
            let carro = await doc.get();
            let carroData = carro.data();
            this.carro = carroData;            
        } catch (error) {
            loggerErr.error(error);
        }
        
    }
    
    async deleteProdByCartId(id,id_prod) {
        const producto = new Producto();
        try {
            let db = admin.firestore()
            let query = db.collection('carritos');
            let doc = query.doc(String(id));
            let productoAdd = await producto.getById(id_prod);
            const item = await doc.update({
                productos: admin.firestore.FieldValue.arrayRemove(productoAdd)
            })
            let carro = await doc.get();
            let carroData = carro.data();
            this.carro = carroData;    
        } catch (error) {
            loggerErr.error(error);
        }   
    }
};

log4js.configure({
  appenders: {
    loggerConsole: { type: 'console' },
    loggerFile: { type: 'file', filename: 'info.log' },
    warnFile: { type: 'file', filename: 'warn.log' },
    errorFile: { type: 'file', filename: 'error.log' },
  },
  categories: {
    default: { appenders: ['loggerConsole','loggerFile'], level: 'info' },
    warn: { appenders: ['loggerConsole','warnFile'], level: 'warn' },
    error: { appenders: ['loggerConsole','errorFile'], level: 'error' },
  },
});

const logger = log4js.getLogger('default');
const loggerWarn = log4js.getLogger('warn');
const loggerErr = log4js.getLogger('error');

const chat = new Contenedor();
const producto = new Producto();
const Carro = new Carrito();

app.get("/", (req,res) => {
    logger.info(`ruta '${req.url}' metodo '${req.method}'`);
    if (req.isAuthenticated()) {
        res.redirect('/login')
    } 
    else {
        res.render('login.pug')
    }
});

app.post("/login", passport.authenticate("login", { failureRedirect: "/failogin" }), (req,res) => {
    logger.info(`ruta '${req.url}' metodo '${req.method}'`);
    const carrId = req.user.carrito;
    const user = req.user.username;
    producto
        .getAll(carrId)
        .then(() => res.render('index.pug', {productos:producto.datos, usuario: user, userdata:producto.userdata}))
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
    logger.info(`ruta '${req.url}' metodo '${req.method}'`);
    const carrId = req.user.carrito;
    const user = req.user.username;
    producto
        .getAll(carrId)
        .then(() => res.render('index.pug', {productos:producto.datos, usuario: user, userdata:producto.userdata}))
})

app.post("/signup", passport.authenticate("signup", { failureRedirect: "/failsignup" }), (req,res) => {
    logger.info(`ruta '${req.url}' metodo '${req.method}'`);
    const userData = req.body
    Carro
        .saveNewCart(userData)
        .then(() => res.redirect('/subidor'));
})

app.get("/signup", (req, res) => {
    logger.info(`ruta '${req.url}' metodo '${req.method}'`);
    Carro
        .newCart()
        .then(() => res.render('signup.pug', {carro:Carro.carro}));
})

app.get("/failsignup", (req, res) => {
    logger.info(`ruta '${req.url}' metodo '${req.method}'`);
    res.render('failsignup.pug')
 })

app.get("/failogin", (req, res) => {
    logger.info(`ruta '${req.url}' metodo '${req.method}'`);
    res.render('failogin.pug')
})

app.get("/logout", (req, res) => {
    logger.info(`ruta '${req.url}' metodo '${req.method}'`);
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

app.get("/info", (req, res) => {
    logger.info(`ruta '${req.url}' metodo '${req.method}'`);
    try {
        res.render('info.pug')
    } catch (error) {
        loggerErr.error(error)
    }
})

app.get("/api/carrito/", (req,res) => {
    logger.info(`ruta '${req.url}' metodo '${req.method}'`);
    if (req.isAuthenticated()) {
        const carrId = req.user.carrito;
        const user = req.user.username;
        Carro
            .getUserInfo(carrId)
            .then(() => res.render('carrito.pug', { carrito:Carro.carro, usuario:user, userdata:Carro.userdata } ));
    } else {
        res.render('login.pug')
    }
})

app.post("/api/carrito/", (req,res) => {
    logger.info(`ruta '${req.url}' metodo '${req.method}'`);
    if (req.isAuthenticated()) {
        const carrId = req.user.carrito;
        const user = req.user.username;
        Carro
            .sendUserCart(carrId)
            .then(() => res.render('carritoSend.pug', { carrito:carrId, usuario:user} ));
    } else {
        res.render('login.pug')
    }
})

app.post('/api/carrito/:id/productos/:id_prod', (req, res) => {
    const { id,id_prod } = req.params;
    Carro
        .addProdByCartId(id,id_prod)
        .then(() => res.json(Carro.carro));
});

app.delete('/api/carrito/:id/productos/:id_prod', (req, res) => {
    const { id,id_prod } = req.params;
    Carro
        .deleteProdByCartId(id,id_prod)
        .then(() => res.json(Carro.carro));
});

app.get('/subidor', (req, res) => {
    res.render('subidor.pug')
})

app.post('/subidor', upload.single('avatar'), function (req, res, next) {
    if(req.user){
        let id = req.user.carrito
        let aPath = req.file.path
        Carro
            .saveAvatar(id,aPath)
            .then(() => res.redirect('/login'))
    } else {
        res.render('login.pug')
    }
})

app.get('/favicon.ico', (req, res) => res.status(200))

app.all("*", (req,res) => {
    loggerWarn.warn(`ruta '${req.url}' metodo '${req.method}' no implementado`);  
    res.json({
        error: -2,
        descripcion: `ruta '${req.url}' metodo '${req.method}' no implementado`
    });
})
