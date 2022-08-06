const fs = require("fs");
const express = require("express");
const { Router } = express;
const app = express();
const PORT = process.env.PORT || 8080;
const router = Router();
const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
});

server.on("error", (error)=>console.log(`Error en el servidor ${error}`))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/productos", router);
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
                console.log(datosJson)
                let maxId = datosJson.map(i=>i.id).sort((a, b) => {if(a == b) {return 0;}if(a < b) {return -1;}return 1;}).splice(-1);
                let nuevoId = parseInt(maxId)+1;
                product = {id:nuevoId, ...product}
                datosJson.push(product);
                this.byId = product;
                this.datos = datosJson;
                fs.promises.writeFile(this.nombreArchivo, JSON.stringify(datosJson, null, 1));
            }
            else{
                this.datos = { error : 'producto no encontrado' };
            }
        } catch (error) {
            console.log(error);
        }
    }

    async updateById(id,body) {
        try {
            console.log(id,body)
            let datos = await fs.promises.readFile(this.nombreArchivo,"utf-8");
            let datosJson = await JSON.parse(datos);
            if (datosJson.find(i=>i.id == id)){
                let borrarId = datosJson.find(i=>i.id == id);
                let posicionId = datosJson.indexOf(borrarId);
                datosJson.splice(posicionId,1);
                body = {id:parseInt(id), ...body};
                datosJson.push(body);
                this.byId = datosJson;
                fs.promises.writeFile(this.nombreArchivo, JSON.stringify(datosJson, null, 1));
                console.log("ID reemplazado");
            } else{
                this.byId = { error : 'producto no encontrado' };
                console.log("No existe elemento con esa ID");
            }
        } catch (error) {
            console.log(error)
        }
    }

    async deleteById(id) {
        try {
            let datos = await fs.promises.readFile(this.nombreArchivo,"utf-8");
            let datosJson = await JSON.parse(datos);
            console.log(datosJson)
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
    const body = req.body;
    producto.save(body).then(() => res.json(producto.byId));
});
router.put("/:id", (req,res) => {
    const { id } = req.params;
    const body = req.body;
    producto.updateById(id,body).then(() => res.json(producto.byId));
})
router.delete("/:id", (req,res) => {
    const { id } = req.params;
    producto.deleteById(id).then(() => res.json(producto.datos));
})  