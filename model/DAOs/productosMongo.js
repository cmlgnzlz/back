const esquemaProd = require('../models/schemaProd');
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
            let datos = await esquemaProd.find({_id:id})
            if (datos.find(i=>i.id == id)){
                await esquemaProd.findOneAndUpdate({_id:id},body)
                let datoNuevo = await esquemaProd.find({_id:id})
                this.byId = datoNuevo;
                this.datos = datoNuevo;
            } else {
                this.byId = { error : 'producto no encontrado' };
            }
        } catch (error) {
            loggerErr.error(error);
        }
    }

    async getById(id) {
        try {
            let datos = await esquemaProd.find({_id:id})
            if(datos.find(i=>i.id == id)){
                let productoArr = datos.find(obj => {
                    return obj
                })
                this.byId.id = productoArr.id;
                this.byId.name = productoArr.name;
                this.byId.price = productoArr.price;
                this.byId.img = productoArr.img;
                this.byId.desc = productoArr.desc
                this.byId.cat = productoArr.cat;
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

    async getProdbyCat(categoria){
        try {
            console.log(categoria)
            let datos = await esquemaProd.find({cat:categoria});
            console.log(datos)
            this.datos = datos;
            return this.datos
        } catch (error) {
            loggerErr.error(error);
        }
    }

    async deleteById(id) {
        try {
            let datos = await esquemaProd.find({_id:id})
            if (datos.find(i=>i.id == id)){
                const productoBorrar = await esquemaProd.deleteOne({_id:id});
                let datos = await esquemaProd.find();
                this.datos = datos;
            } else{
                this.datos = { error : 'producto no encontrado' };
            }
        } catch (error) {
            loggerErr.error(error);
        }
    }
};

module.exports = ProductoMongoDAO;