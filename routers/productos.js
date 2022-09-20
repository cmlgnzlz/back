const express = require('express');
const {productosDaos: Producto} = require('../daos/mainDaos');
const routerProd = express.Router();

let admin = true
const producto = new Producto()

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
        then(() => res.json(producto.byId))
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
        then(() => res.json(producto.byId))
    }else{
        res.json(`ruta '${req.url}' metodo '${req.method}' no autorizada`);
    }
})

routerProd.delete("/:id", (req,res) => {
    const { id } = req.params;
    if(admin==true){
        producto.deleteById(id).
        then(() => res.json(producto.datos))
    }else{
        res.json(`ruta '${req.url}' metodo '${req.method}' no autorizada`);
    }
})

module.exports = routerProd;
