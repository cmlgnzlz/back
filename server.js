const express = require('express');
const app = express();
const routerProd = require('./routers/productos');
const routerCarr = require('./routers/carrito');
const httpServer = require("http").createServer(app);
const {productosDaos: Producto} = require('./daos/mainDaos');

httpServer.listen(process.env.PORT || 8080, () => console.log(`Server ON. Escuchando en el puerto ${httpServer.address().port}`));

app.use('/public', express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'pug');
app.set('views', './views');


app.use('/api/productos', routerProd)
app.use('/api/carrito', routerCarr)

const producto = new Producto()

app.get("/", (req,res) => {  
    producto.getAll().
    then(() => res.render('index.pug', { productos: producto.datos } ));
});

app.all("*", (req,res) => {  
    res.json({
        error: -2,
        descripcion: `ruta '${req.url}' metodo '${req.method}' no implementado`
    });
})

