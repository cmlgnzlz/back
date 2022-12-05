const Router = require('express'); 
const {getProd, postProd, putProd, deleteProd} = require("../controllers/productos");
const routerProds = new Router();

routerProds.get("/",getProd)
routerProds.post("/",postProd)
routerProds.put("/:id",putProd)
routerProds.delete("/:id",deleteProd)

module.exports = routerProds;