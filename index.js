const express = require('express');
const compression = require('compression')
const dotenv = require("dotenv");
const path = require("path");
require("dotenv").config(
    {path: path.resolve(process.cwd(), process.env.NODE_ENV + ".env")}
);
const PORT = process.env.PORT || 5000
const app = express();

const httpServer = require("http").createServer(app);
httpServer.listen(PORT, () => console.log(`Server ON. Escuchando en el puerto ${httpServer.address().port}`));

const mongoose = require('mongoose');

mongoose
    .connect(process.env.MONGOADD)
    .then(() => console.log("Connected to DB"))
    .catch((e) => {
        console.error(e);
        throw "ERROR CONECTANDO A LA DB";
    });

const io = require("socket.io")(httpServer);

const { logger, loggerWarn }  = require('./config/logger')

app.use(compression())
app.use(express.json());
app.use('/public', express.static(__dirname + "/public"));
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));

require('./config/passport')(app)

const routerInfo = require('./routers/routerInfo')
const routerCarro = require('./routers/routerCarro')
const routerDatos = require('./routers/routerDatos')
const routerProds = require('./routers/routerProds')
app.use('/info', routerInfo)
app.use('/', routerDatos)
app.use('/carrito', routerCarro)
app.use('/productos', routerProds)
app.set('view engine', 'pug');
app.set('views', './views');

app.get("/", (req,res) => {
    logger.info(`ruta '${req.url}' metodo '${req.method}'`);
    if (req.isAuthenticated()) {
        res.redirect('/productos')
    } 
    else {
        res.render('login.pug')
    }
});

app.get('/favicon.ico', (req, res) => res.status(200))

const Chat = require('./model/DAOs/chat')
const chat = new Chat();
io.on('connect', (socket) => {
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

app.all("*", (req,res) => {
    loggerWarn.warn(`ruta '${req.url}' metodo '${req.method}' no implementado`);  
    res.json({
        error: -2,
        descripcion: `ruta '${req.url}' metodo '${req.method}' no implementado`
    });
});