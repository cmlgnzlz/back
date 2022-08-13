const fs = require("fs");
const express = require('express');
const app = express();
const PORT = 8080;

const server = app.listen(PORT, () => {
  console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
});

server.on('error', (error) => console.log(`Error en servidor ${error}`));
app.use('/public', express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');

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

  async save(product) {
      try {
          let datos = await fs.promises.readFile(this.nombreArchivo,"utf-8");
          let datosJson = await JSON.parse(datos);
          if (datosJson.length>0){
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
};

const producto= new Contenedor("productos.txt");

app.get("/", (req,res) => {  
    res.render('pages/formulario', {title: 'Formulario'});
});

app.get('/productos', (req, res) => {
  const body = req.body;
  producto.getAll(body).then(() => res.render('pages/productos', { productos: producto.datos, title: 'Listado de productos' }));
})

app.post('/productos', (req, res) => {
    const body = req.body;
    producto.save(body).then(() => res.render('pages/productos', { productos: producto.datos, title: 'Listado de productos' }));
})