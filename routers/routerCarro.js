const Router = require('express'); 
const { getCarrito, postCarrito, postProd, deleteProd, getCarritoMod } = require('../controllers/carro');
const routerCarro = new Router();

routerCarro.get("/", getCarrito);
routerCarro.post("/", postCarrito);
routerCarro.post('/:id/productos/:id_prod', postProd);
routerCarro.delete('/:id/productos/:id_prod', deleteProd);
routerCarro.get("/:id", getCarritoMod)
routerCarro.post('/:id/productos/:id_prod/delete', deleteProd);

module.exports = routerCarro;