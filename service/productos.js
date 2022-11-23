const esquemaProd = require('../api/schemaProd');
const Carrito = require('../service/carro')

const { loggerErr } = require('../config/logger')

class Producto{

    constructor() {
        this.datos = [];
        this.userdata = {};
        this.byId = {};
        
    }

    async getAll(carrId){
        try {
            let Carro = new Carrito()
            let datos = await esquemaProd.find();
            let userData = await Carro.getUserInfo(carrId);
            this.datos = datos;
            this.userdata = userData.userdata;
            return this
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
                this.byId.qty = 1;
            } else{
                return
            }
            return this.byId;
        } catch (error) {
            loggerErr.error(error);
        }
    }
};

module.exports = Producto;