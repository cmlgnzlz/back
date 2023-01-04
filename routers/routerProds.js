const Router = require('express'); 
const {getProd, getProdById, postProd, putProd, deleteProd, getProdbyCat} = require("../controllers/productos");
const routerProds = new Router();

routerProds.get("/",getProd)
routerProds.get("/categoria/:cat",getProdbyCat)
routerProds.get("/:id",getProdById)
routerProds.post("/",postProd)
routerProds.put("/:id",putProd)
routerProds.delete("/:id",deleteProd)

module.exports = routerProds;