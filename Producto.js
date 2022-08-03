const fs = require("fs");
const express = require("express");
const { Router } = express;
const app = express();
const router = Router();
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
});

server.on("error", (error)=>console.log(`Error en el servidor ${error}`))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/productos", router)
app.use(express.static('public'));


class Contenedor{

    constructor(nombreArchivo) {
        this.nombreArchivo = nombreArchivo;
        this.datos = [];
        this.byId = {};
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
            if(datosJson.find(i=>i.id === id)){
                console.log(datosJson.find(i=>i.id === id));
                this.byId = datosJson.find(i=>i.id === id);
            } else{
                this.byId = null;
                console.log("No existe elemento con esa ID");
            }
                
        } catch (error) {
            console.log(error)
        }
    }

    async save(product) {
        try {
            console.log('el producto es',product)
            let datos = await fs.promises.readFile(this.nombreArchivo,"utf-8")
            let datosJson = await JSON.parse(datos)
            if (datosJson.length>0){
                product.id= datosJson.length+1
                console.log(product)
                datosJson.push(product)
                this.datos = datosJson
                console.log("Producto agregado",this.datos)
            }
            else{
                console.log("Vacio")
            }
        } catch (error) {
            console.log(error)
        }
    }
};

const producto= new Contenedor("productos.txt");

app.get("/", (req,res) => {  
    res.sendFile('index.html');
})
router.get("/", (req,res) => {
    producto.getAll().then(() => res.json(producto.datos));
})
router.get("/:id", (req,res) => {
    const { id } = req.params;
    producto.getById(id).then(() => res.json(producto.byId));
})
router.post('/', (req, res) => {
    const { body } = req;
    console.log(body)
    producto.save(body).then(() => res.json(producto.datos));
});  