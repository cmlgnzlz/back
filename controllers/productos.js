const {logger} = require('../config/logger');
const fs = require("fs");
const { Console } = require('console');

const productosObj = {};

class Producto {
    constructor(id, { name, price, qty, img, desc }) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.qty = qty;
        this.img = img;
        this.desc = desc;
    }
}

async function getData() {
    let datos = await fs.promises.readFile("./api/productos.txt","utf-8");
    let datosJson = JSON.parse(datos)
    return datosJson
}

async function saveData(datosJson){
    let datosFS = JSON.stringify(datosJson)
    fs.promises.writeFile("./api/productos.txt",datosFS)
    return true
}

async function getProds({ campo, valor }) {
    let datosJson = await getData()
    let productos = Object.values(datosJson);
    if (campo && valor) {
        return productos.filter((i) => i[campo] == valor);
    } else {
        return productos;
    }
}

async function getProdById({ id }) {
    let datosJson = await getData()
    if(!datosJson.find(i=>i.id == id)){
        throw new Error("No encontrado")
    }
    let productoArr = datosJson.filter( i => i.id == id)
    let product = productoArr.find(obj => {
            return obj
    })
    return product
}

async function postProd({ datos }) {
    let datosJson = await getData()
    let maxId = datosJson.map(i=>i.id).sort((a, b) => {if(a == b) {return 0;}if(a < b) {return -1;}return 1;}).splice(-1);
    let nuevoId = parseInt(maxId)+1
    let nuevoProd = new Producto(nuevoId, datos)
    await datosJson.push(nuevoProd);
    let saveDatosJson = await saveData(datosJson);
    return nuevoProd;
}

async function putProd({ id, datos }) {
    let datosJson = await getData()
    console.log(datosJson)
    if (!datosJson.find(i=>i.id == id)){
        throw new Error("No encontrado")
    } 
    let producto = datos
    let indice = datosJson.findIndex(i=>i.id == id);
    let productoActual = datosJson[indice] || {};
    let productoActualizado = { ...productoActual, ...producto };
    datosJson.splice(indice, 1, productoActualizado)
    console.log(datosJson)
    let saveDatosJson = await saveData(datosJson);
    return productoActualizado
}

async function deleteProd({ id }) {
    let datosJson = await getData()
    console.log(datosJson)
    if (!datosJson.find(i=>i.id == id)){
        throw new Error("No encontrado")
    } 
    let indice = datosJson.findIndex(i=>i.id == id);
    let borrado = datosJson[indice]
    datosJson.splice(indice, 1)
    let saveDatosJson = await saveData(datosJson)
    return borrado

}

module.exports = { getProds, getProdById, postProd, putProd, deleteProd };