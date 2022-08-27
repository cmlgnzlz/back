const fs = require("fs");
const express = require('express');
const { Router } = express;
const app = express();
const routerProd = Router();
const routerCarr = Router();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);

httpServer.listen(process.env.PORT || 8080, () => console.log(`Server ON. Escuchando en el puerto ${httpServer.address().port}`));

app.use(express.json());
app.use("/api/productos", routerProd)
app.use("/api/carrito", routerCarr)
app.use('/public', express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'pug');
app.set('views', './views');

let admin = true;

class Contenedor{

    constructor(nombreArchivo) {
        this.nombreArchivo = nombreArchivo;
        this.datos = [];
        this.byId = {};
        this.carro = {};
    }

    async getAll(){
        try {
            let datos = await fs.promises.readFile(this.nombreArchivo,"utf-8");
            let datosJson = await JSON.parse(datos);
            this.datos = datosJson;
        } catch (error) {
            console.log(error);
        }
    }

    async getById(id) {
        try {
            let datos = await fs.promises.readFile(this.nombreArchivo,"utf-8");
            let datosJson = await JSON.parse(datos);
            if(datosJson.find(i=>i.id == id)){
                this.byId = datosJson.find(i=>i.id == id);
            } else{
                this.byId = this.datos = { error : 'producto no encontrado' };
            }
                
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
                this.datos = { error : 'error' };
            }
        } catch (error) {
            console.log(error);
        }
    }

    async updateById(id,body) {
        try {
            let datos = await fs.promises.readFile(this.nombreArchivo,"utf-8");
            let datosJson = await JSON.parse(datos);
            if (datosJson.find(i=>i.id == id)){
                let borrarId = datosJson.find(i=>i.id == id);
                let posicionId = datosJson.indexOf(borrarId);
                body = {id:parseInt(id), ...body};
                datosJson.splice(posicionId,1,body);
                this.byId = datosJson;
                this.datos = datosJson;
                fs.promises.writeFile(this.nombreArchivo, JSON.stringify(datosJson, null, 1));
            } else{
                this.byId = { error : 'producto no encontrado' };
            }
        } catch (error) {
            console.log(error)
        }
    }

    async deleteById(id) {
        try {
            let datos = await fs.promises.readFile(this.nombreArchivo,"utf-8");
            let datosJson = await JSON.parse(datos);
            if (datosJson.find(i=>i.id == id)){
                let borrarId = datosJson.find(i=>i.id == id);
                let posicionId = datosJson.indexOf(borrarId);
                datosJson.splice(posicionId,1);
                this.datos = datosJson;
                fs.promises.writeFile(this.nombreArchivo, JSON.stringify(datosJson, null, 1));
                console.log("ID eliminado");
            } else{
                this.datos = { error : 'producto no encontrado' };
                console.log("No existe elemento con esa ID");
            }
        } catch (error) {
            console.log(error);
        }
    }

    async saveNewCart() {
        let carros = await fs.promises.readFile('carro.txt',"utf-8");
        let carrosJson = await JSON.parse(carros);
        if(carrosJson.length>=0){
            let id = parseInt(carrosJson.length)+1;
            if(carrosJson.some( (i) => i.id === id)){ //BUSQUEDA DE CARRO
                console.log('carrito ya existe');
            }else{
                let stamp = new Date().toLocaleString();
                let productos = [];
                let carro = {id:id,stamp:stamp,productos:productos};
                carrosJson.push(carro);
                this.carro=carro;
                fs.promises.writeFile('carro.txt', JSON.stringify(carrosJson, null, 1));
        }}
    }

    async deleteCartById(id) {
        let carros = await fs.promises.readFile('carro.txt',"utf-8");
        let carrosJson = await JSON.parse(carros);
        if (carrosJson.find(i=>i.id == id)){ //BUSQUEDA DE CARRO
            let borrarId = carrosJson.find(i=>i.id == id);
            let posicionId = carrosJson.indexOf(borrarId);
            carrosJson.splice(posicionId,1);
            this.carro = carrosJson;
            fs.promises.writeFile('carro.txt', JSON.stringify(carrosJson, null, 1));
            console.log("Carro id: " + id + " eliminado");
        } else{
            this.carro = { error : 'carro no encontrado en el sistema' };
        }
    }
    
    async getByCartId(id){
        let carros = await fs.promises.readFile('carro.txt',"utf-8");
        let carrosJson = await JSON.parse(carros);
        if(carrosJson.length>0){
            if(carrosJson.some( (i) => i.id == id)){
                this.carro = carrosJson[id-1];
            }else{
                this.carro = { error : 'carro no encontrado en el sistema' };
        }} else{
            this.carro = { error : 'Sistema de carros vacio' };
        }
    }

    async addProdByCartId(id,id_prod) {
        let carros = await fs.promises.readFile('carro.txt',"utf-8");
        let carrosJson = await JSON.parse(carros);
        if (carrosJson.find(i=>i.id == id)){ //BUSQUEDA DE CARRO
            let datos = await fs.promises.readFile(this.nombreArchivo,"utf-8");
            let datosJson = await JSON.parse(datos);
            if(datosJson.find(i=>i.id == id_prod)){ //BUSQUEDA DE PRODUCTO EN LISTADO
                let carroActual = carrosJson.find(i=>i.id == id);
                let posicionCarro = carrosJson.indexOf(carroActual);
                if(carroActual.productos.find(i=>i.id == id_prod)){ //BUSQUEDA DE PRODUCTO EN CARRO
                    let producto = carroActual.productos.find(i=>i.id == id_prod);
                    producto.stamp = new Date().toLocaleString();
                    producto.qty = parseInt(producto.qty)+1;  //SUMA PREDETERMINADA POR 1 UNIDAD
                    carrosJson.splice(posicionCarro,1,carroActual)
                    this.carro=carroActual
                    fs.promises.writeFile('carro.txt', JSON.stringify(carrosJson, null, 1));
                } else{ //NO EXISTE EL PRODUCTO EN EL CARRO
                    this.byId = datosJson.find(i=>i.id == id_prod);
                    this.byId.stamp = new Date().toLocaleString();
                    this.byId.qty = 1; // INGRESO PREDETERMINADO DE 1 UNIDAD.
                    carroActual.productos.push(this.byId);
                    this.carro=carroActual
                    fs.promises.writeFile('carro.txt', JSON.stringify(carrosJson, null, 1));
                }
            } else{ //NO EXISTE EL PRODUCTO EN EL LISTADO
                this.carro = { error : 'producto no encontrado en el sistema' };
            }
        } else{ //NO EXISTE CARRO
            this.carro = { error : 'carro no encontrado en el sistema' };
        }
    }
    
    async deleteProdByCartId(id,id_prod) {
        let carros = await fs.promises.readFile('carro.txt',"utf-8");
        let carrosJson = await JSON.parse(carros);
        if (carrosJson.find(i=>i.id == id)){ //BUSQUEDA DE CARRO
            let datos = await fs.promises.readFile(this.nombreArchivo,"utf-8");
            let datosJson = await JSON.parse(datos);
            if(datosJson.find(i=>i.id == id_prod)){ //BUSQUEDA DE PRODUCTO EN LISTADO
                let carroActual = carrosJson.find(i=>i.id == id);
                if(carroActual.productos.find(i=>i.id == id_prod)){ //BUSQUEDA DE PRODUCTO EN CARRO
                    let producto = carroActual.productos.find(i=>i.id == id_prod);
                    let posicionProd = carroActual.productos.indexOf(producto)
                    carroActual.productos.splice(posicionProd,1)
                    this.carro = carroActual
                    fs.promises.writeFile('carro.txt', JSON.stringify(carrosJson, null, 1));
                } else{ //NO EXISTE EL PRODUCTO EN EL CARRO
                    this.carro = { error : 'producto no encontrado en carro' };
                }
            } else{ //NO EXISTE EL PRODUCTO EN EL LISTADO
                this.carro = { error : 'producto no encontrado en el sistema' };
            }
        } else{ //NO EXISTE CARRO
            this.carro = { error : 'carro no encontrado' };
        }
    }
};


const producto = new Contenedor("productos.txt");

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

/////////////////////
//ROUTER DE PRODUCTOS
routerProd.get("/", (req,res) => {
    producto.getAll().
    then(() => res.json(producto.datos));
})

routerProd.get("/:id", (req,res) => {
    const { id } = req.params;
    producto.getById(id).
    then(() => res.json(producto.byId));
})

routerProd.post('/', (req, res) => {
    const body = req.body;
    if(admin==true){
        producto.save(body).
        then(() => res.json(producto.byId)).
        then(() => io.sockets.emit('productoAgrega', producto.byId));
    }else{
        res.json(`ruta '${req.url}' metodo '${req.method}' no autorizada`);
    }
});

routerProd.put("/:id", (req,res) => {
    const { id } = req.params;
    const body = req.body;
    console.log(body);
    if(admin==true){
        producto.updateById(id,body).
        then(() => res.json(producto.byId)).
        then(() => io.sockets.emit('productoActualiza',producto.datos));
    }else{
        res.json(`ruta '${req.url}' metodo '${req.method}' no autorizada`);
    }
})

routerProd.delete("/:id", (req,res) => {
    const { id } = req.params;
    if(admin==true){
        producto.deleteById(id).
        then(() => res.json(producto.datos)).
        then(() => io.sockets.emit('productoBorra',producto.datos));
    }else{
        res.json(`ruta '${req.url}' metodo '${req.method}' no autorizada`);
    }
})

//////////////////
//ROUTER DEL CARRO
routerCarr.post('/', (req, res) => {
    producto.saveNewCart().
    then(() => res.json(producto.carro));
});

routerCarr.delete("/:id", (req,res) => {
    const { id } = req.params;
    producto.deleteCartById(id).
    then(() => res.json(producto.carro));
});

routerCarr.get("/:id/", (req,res) => {
    const { id } = req.params;
    producto.getByCartId(id).
    then(() => res.json(producto.carro));
})

routerCarr.get("/:id/productos", (req,res) => {
    const { id } = req.params;
    producto.getByCartId(id).
    then(() => res.json(producto.carro.productos));
})

routerCarr.post('/:id/productos/:id_prod', (req, res) => {
    const { id,id_prod } = req.params;
    producto.addProdByCartId(id,id_prod).
    then(() => res.json(producto.carro));
});

routerCarr.delete('/:id/productos/:id_prod', (req, res) => {
    const { id,id_prod } = req.params;
    producto.deleteProdByCartId(id,id_prod).
    then(() => res.json(producto.carro));
});

//SOCKET.IO
io.on('connect', socket => {
    console.log('Usuario conectado ' + socket.id);

    socket.on('productoNuevo', datos => {
        if(admin==true){
            producto.
            save(datos).
            then(() => io.sockets.emit('productoAgrega', producto.byId));
        }else{
            console.log(adminError)
        } 
    })
})