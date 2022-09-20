const express = require('express');
const {carroDaos: Carrito} = require('../daos/mainDaos');
const routerCarr = express.Router();

const Carro = new Carrito()

routerCarr.post('/', (req, res) => {
    Carro.saveNewCart().
    then(() => res.json(Carro.carro));
});

routerCarr.delete("/:id", (req,res) => {
    const { id } = req.params;
    Carro.deleteCartById(id).
    then(() => res.json(Carro.carro));
});

routerCarr.get("/:id/", (req,res) => {
    const { id } = req.params;
    Carro.getByCartId(id).
    then(() => res.json(Carro.carro));
})

routerCarr.get("/:id/productos", (req,res) => {
    const { id } = req.params;
    Carro.getByCartId(id).
    then(() => res.json(Carro.carro.productos));
})

routerCarr.post('/:id/productos/:id_prod', (req, res) => {
    const { id,id_prod } = req.params;
    Carro.addProdByCartId(id,id_prod).
    then(() => res.json(Carro.carro));
});

routerCarr.delete('/:id/productos/:id_prod', (req, res) => {
    const { id,id_prod } = req.params;
    Carro.deleteProdByCartId(id,id_prod).
    then(() => res.json(Carro.carro));
});

module.exports = routerCarr;