
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
});

//server.on("error", error => console.log(`Error en servidor ${error}`))       log para error

app.get('/', (req, res) => {
    res.send({ mensaje: 'hola mundo' })
 })
 