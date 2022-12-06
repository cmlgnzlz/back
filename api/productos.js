const productosFactory = require('../model/DAOs/productosFactory')

class Producto{
    constructor(){
        this.productos = productosFactory.get(process.env.TIPO_PERSISTENCIA)
    }
    async save(product) {
        return await this.productos.save(product)
    }

    async updateById(id,body) {
        return await this.productos.updateById(id,body)
    }

    async getById(id) {
        return await this.productos.getById(id)
    }

    async getProds(){
        return await this.productos.getProds()
    }

    async deleteById(id) {
        return await this.productos.deleteById(id)
    }
}

module.exports = Producto