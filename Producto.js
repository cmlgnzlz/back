const fs = require("fs");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
});

server.on("error", (error)=>console.log(`Error en el servidor ${error}`))

class Contenedor{

    constructor(nombreArchivo) {
        this.nombreArchivo = nombreArchivo;
        this.datos = [];
        this.random = {};
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

    async getRandom() {
        try {
            let datos = await fs.promises.readFile(this.nombreArchivo,"utf-8");
            let datosJson = await JSON.parse(datos);
            let randomPos = Math.floor(Math.random()*datosJson.length);
            this.random = datosJson[randomPos];
        } catch (error) {
            console.log(error);
        }
    }
};

const producto= new Contenedor("productos.txt");

app.get("/", (req,res) => { 
    res.send("Bienvenid@");
})
app.get("/productos", (req,res) => {
    producto.getAll().
    then(() => res.send(producto.datos));
})
app.get("/productorandom", (req,res) => { 
    producto.getRandom().
    then(() => res.send(producto.random));
})