const mongoose = require('mongoose')
const esquemaProd = require('./models/schemaProd')

class Producto{

    constructor() {
        this.datos = [];
        this.byId = {};
        this.carro = {};
    }

    async connectMDB() {
        try {
            const URL = "mongodb+srv://cmlgnzlz:hzbKy1lTYIaO1Ljm@cluster0.a2hirij.mongodb.net/test?retryWrites=true&w=majority"
            let rta = await mongoose.connect(URL, {
                useNewUrlParser: true,
                useUniFiedTopology: true
            })
        } catch (e) {
            console.log(e)
        }   
    }

    async getAll(){
        try {
            await this.connectMDB();
            let datos = await esquemaProd.find();
            console.log('hola');
            console.log(datos);
            mongoose.disconnect();
            this.datos = datos;
        } catch (error) {
            console.log(error);
        }
    }

    async getById(id) {
        try {
            await this.connectMDB();
            let datos = await esquemaProd.find({id})
            if(datos.find(i=>i.id == id)){
                this.byId = datos
            } else{
                this.byId = this.datos = { error : 'producto no encontrado' };
            }
            return this.byId;
        } catch (error) {
            console.log(error);
        }
    }

    async save(product) {
        try {
            await this.connectMDB();
            let datos = await esquemaProd.find({})
            let maxId = datos.map(i=>i.id).sort((a, b) => {if(a == b) {return 0;}if(a < b) {return -1;}return 1;}).splice(-1);
            let nuevoId = parseInt(maxId)+1;
            product = {id:nuevoId, ...product}
            let productoNuevo = new esquemaProd(product);
            console.log(productoNuevo)
            await productoNuevo.save()
            this.byId = product;
            this.datos = datos;
        } catch (error) {
            console.log(error);
        }
    }

    async updateById(id,body) {
        try {
            await this.connectMDB();
            const filtro = {id:id};
            console.log(filtro)
            const update = body;
            let datos = await esquemaProd.find({id})
            if (datos.find(i=>i.id == id)){
                let product = {id:parseInt(id), ...body};
                await esquemaProd.findOneAndUpdate(filtro,update)
                let datoNuevo = await esquemaProd.find({id})
                this.byId = datoNuevo;
                this.datos = datoNuevo;
            } else{
                this.byId = { error : 'producto no encontrado' };
            }
        } catch (error) {
            console.log(error)
        }
    }

    async deleteById(id) {
        try {
            await this.connectMDB();
            let filtro = {id:id};
            let datos = await esquemaProd.find({id})
            if (datos.find(i=>i.id == id)){
                const productoBorrar = await esquemaProd.deleteOne(filtro)
                this.datos = datos
            } else{
                this.datos = { error : 'producto no encontrado' };
                console.log("No existe elemento con esa ID");
            }
        } catch (error) {
            console.log(error);
        }
    }
};

module.exports = Producto;