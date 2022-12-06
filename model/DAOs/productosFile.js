const fs = require("fs");
const esquemaProd = require('../models/schemaProd');
const { loggerErr } = require('../../config/logger')
const ProductoBase = require('./productos')

class ProductoFileDAO extends ProductoBase{

    constructor() {
        super();
    }

    async save(product) {
        try {
            ProductoBase.validar(product)
            let datos = await fs.promises.readFile("./api/productos.txt","utf-8");
            let datosJson = JSON.parse(datos)
            let maxId = datosJson.map(i=>i.id).sort((a, b) => {if(a == b) {return 0;}if(a < b) {return -1;}return 1;}).splice(-1);
            let nuevoId = parseInt(maxId)+1;
            product = {id:nuevoId, ...product}
            await datosJson.push(product)
            this.byId = product;
            this.datos = datos;
            let datosFS = JSON.stringify(datosJson)
            fs.promises.writeFile("./api/productos.txt",datosFS)
        } catch (error) {
            loggerErr.error(error);
        }
    }

    async updateById(id,body) {
        try {
            let datos = await fs.promises.readFile("api/productos.txt","utf-8");
            let datosJson = JSON.parse(datos)
            if (datosJson.find(i=>i.id == id)){
                let producto = body
                let indice = datosJson.findIndex(i=>i.id == id);
                let productoActual = datosJson[indice] || {};
                let productoActualizado = { ...productoActual, ...producto };
                datosJson.splice(indice, 1, productoActualizado)
                let datosFS = JSON.stringify(datosJson)
                fs.promises.writeFile("./api/productos.txt",datosFS)
                this.byId = productoActualizado
            } else{
                this.byId = { error : 'producto no encontrado' };
            }
            return this.byId
        } catch (error) {
            loggerErr.error(error);
        }
    }

    async getById(id) {
        try {
            let datos = await fs.promises.readFile("api/productos.txt","utf-8");
            let datosJson = JSON.parse(datos)
            if(datosJson.find(i=>i.id == id)){
                let productoArr = datosJson.filter( i => i.id == id)
                let product = productoArr.find(obj => {
                    return obj
                })
                this.byId = product
            } else{
                this.byId = { error : 'producto no encontrado' }
            }
            return this.byId;
        } catch (error) {
            loggerErr.error(error);
        }
    }

    async getProds(){
        try {
            let datos = await fs.promises.readFile("api/productos.txt","utf-8");
            let datosJson = JSON.parse(datos)
            this.datos = await datosJson;
            return this.datos
        } catch (error) {
            loggerErr.error(error);
        }
    }

    async deleteById(id) {
        try {
            let datos = await fs.promises.readFile("api/productos.txt","utf-8");
            let datosJson = JSON.parse(datos)
            if (datosJson.find(i=>i.id == id)){
                let indice = datosJson.findIndex(i=>i.id == id);
                datosJson.splice(indice, 1)
                this.datos = datosJson
                let datosFS = JSON.stringify(datosJson)
                fs.promises.writeFile("./api/productos.txt",datosFS)
                console.log(this)
            } else{
                this.datos = { error : 'producto no encontrado' };
            }
            return this.datos
        } catch (error) {
            console.log(error);
        }
    }
};

module.exports = ProductoFileDAO;