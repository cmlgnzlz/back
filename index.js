const express = require('express');
const compression = require('compression')
require("dotenv").config();
const PORT = process.env.PORT || 5000
const app = express();
const cors = require("cors");
const { graphqlHTTP } =require("express-graphql");
const { getProds, getProdById, postProd, putProd, deleteProd } = require("./controllers/productos");
const schema = require("./model/models/schema")

const httpServer = require("http").createServer(app);
httpServer.listen(PORT, () => console.log(`Server ON. Escuchando en el puerto ${httpServer.address().port}`));

const { loggerWarn }  = require('./config/logger')

app.use(compression())
app.use(cors());
app.use(express.json());
app.use('/public', express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

app.use(
    "/api/productos",
    graphqlHTTP({
        schema: schema,
        rootValue: {
        getProds,
        getProdById,
        postProd,
        putProd,
        deleteProd,
        },
        graphiql: true,
    })
);

app.get('/favicon.ico', (req, res) => res.status(200))

app.all("*", (req,res) => {
    loggerWarn.warn(`ruta '${req.url}' metodo '${req.method}' no implementado`);  
    res.json({
        error: -2,
        descripcion: `ruta '${req.url}' metodo '${req.method}' no implementado`
    });
});


