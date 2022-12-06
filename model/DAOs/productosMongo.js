const esquemaProd = require('../models/schemaProd');
const Joi = require('joi')
const { loggerErr } = require('../../config/logger')
const ProductoBase = require('./productos')

class ProductoMongoDAO extends ProductoBase{

    constructor() {
        super();
    }

    async save(product) {
        try {
            ProductoBase.validar(product)
            let datos = await esquemaProd.find({})
            let maxId = datos.map(i=>i.id).sort((a, b) => {if(a == b) {return 0;}if(a < b) {return -1;}return 1;}).splice(-1);
            let nuevoId = parseInt(maxId)+1;
            product = {id:nuevoId, ...product}
            let productoNuevo = new esquemaProd(product);
            await productoNuevo.save()
            this.byId = product;
            this.datos = datos;
        } catch (error) {
            loggerErr.error(error);
        }
    }

    async updateById(id,body) {
        try {
            const filtro = {id:id};
            let datos = await esquemaProd.find({id})
            if (datos.find(i=>i.id == id)){
                let update = {id:parseInt(id), ...body};
                await esquemaProd.findOneAndUpdate(filtro,update)
                let datoNuevo = await esquemaProd.find({id})
                this.byId = datoNuevo;
                this.datos = datoNuevo;
            } else{
                this.byId = { error : 'producto no encontrado' };
            }
        } catch (error) {
            loggerErr.error(error);
        }
    }

    async getById(id) {
        try {
            let datos = await esquemaProd.find({id}).lean()
            if(datos.find(i=>i.id == id)){
                let productoArr = datos.find(obj => {
                    return obj
                })
                this.byId.id = productoArr.id;
                this.byId.name = productoArr.name;
                this.byId.price = productoArr.price;
                this.byId.img = productoArr.img;
                this.byId.qty = productoArr.qty;
                this.byId.desc = productoArr.desc
            } else{
                return this.byId
            }
            return this.byId;
        } catch (error) {
            loggerErr.error(error);
        }
    }

    async getProds(){
        try {
            let datos = await esquemaProd.find();
            this.datos = datos;
            return this.datos
        } catch (error) {
            loggerErr.error(error);
        }
    }

    async deleteById(id) {
        try {
            let filtro = {id:id};
            let datos = await esquemaProd.find({id})
            if (datos.find(i=>i.id == id)){
                const productoBorrar = await esquemaProd.deleteOne(filtro);
                let datos = await esquemaProd.find();
                this.datos = datos;
            } else{
                this.datos = { error : 'producto no encontrado' };
                console.log("No existe elemento con esa ID");
            }
        } catch (error) {
            console.log(error);
        }
    }
};

module.exports = ProductoMongoDAO;