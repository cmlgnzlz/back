const esquemaCarro = require('../models/schemaCarro')
const esquemaOrden = require('../models/schemaOrden')
const {loggerErr} = require('../../config/logger')
const Producto = require('../../api/productos');

const nodemailer = require("nodemailer")
const adminEth = 'daphnee92@ethereal.email'
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: adminEth,
        pass: process.env.ETHEREAL
    }
});

class Carrito{

    constructor() {
        this.carro = {};
        this.userdata = {};
    }

    async saveNewCart(userData) { 
        try {
            let tipo = "usuario"
            let id = userData.username
            let data = {nombre:userData.nombre,telefono:userData.telefono};
            let productos = [];
            let carro = {id:id,data:data,productos:productos,tipo:tipo};
            let carroNuevo = new esquemaCarro(carro);
            await carroNuevo.save()
            this.carro = carro;
            const mailOptions = {
                from: 'Servidor Node',
                to: adminEth,
                subject: 'Nuevo registro en el servidor',
                html: `<div><p style="color: blue;font-size:2rem">Nuevo registro de:</p><p style="color: red;font-size:1.4rem">correo:${data.username}</p><p style="color: red;font-size:1.4rem">nombre:${data.nombre}</p><p style="color: red;font-size:1.4rem">direccion:${data.direccion}</p><p style="color: red;font-size:1.4rem">edad:${data.edad}</p><p style="color: red;font-size:1.4rem">telefono:${data.telefono}</p><p style="color: red;font-size:1.4rem">carrito:${id}</p></div>`
             }
             const info = await transporter.sendMail(mailOptions)
        } catch (error) {
            loggerErr.error(error);
        }
    }

    async deleteCartById(id) {
        try {
            let filtro = {id:id};
            let carro = await esquemaCarro.find(filtro)
            if (carro.find(i=>i.id == id)){
                const productoBorrar = await esquemaCarro.deleteOne(filtro);
                let datos = await esquemaProd.find();
                this.carro = datos;
            } else{
                this.carro = { error : 'carro no encontrado' };
            }
        } catch (error) {
            loggerErr.error(error);
        }
    }
    
    async getByCartId(id){
        try {
            let filtro = {id:id};
            let carro = await esquemaCarro.find(filtro)
            if (carro.find(i=>i.id == id)){
                this.carro = carro;
            } else{
                this.carro = { error : 'carro no encontrado' };
            }
        } catch (error) {
            loggerErr.error(error);
        }
    }

    async getUserInfo(id){
        try {
            let filtro = {id:id};
            let carro = await esquemaCarro.find(filtro)
            if (carro.find(i=>i.id == id)){
                let carroArr = carro.find(obj => {
                    return obj
                })
                this.id = carroArr.id
                this.data = carroArr.data
                this.carro = carroArr.productos;
            } else {
                this.carro = { error : 'carro no encontrado' };
            }
            return this
        } catch (error) {
            loggerErr.error(error);
        }
    }

    async addProdByCartId(id,id_prod,qty) {
        let producto = new Producto();
        try {
            let cantidad = qty || 1;
            let carro = await esquemaCarro.find({id:id});
            let carroArr = carro.find(obj => {
                return obj
            })
            let carroActual = carroArr.productos
            let getProduct = await producto.getById(id_prod);
            getProduct.qty = cantidad;
            if(carroActual.find(i=> i.id ==! id_prod)){
                carroActual.push(getProduct)
                let doc = await esquemaCarro.findOneAndUpdate({ id },{productos: carroActual});
                this.carro = carroActual
            } else {
                let carroNuevo = carroActual.filter(i=> i.id !== id_prod);
                carroNuevo.push(getProduct);
                let doc = await esquemaCarro.findOneAndUpdate({ id },{productos: carroNuevo});
                this.carro = carroNuevo
            }
            return this
        } catch (error) {
            loggerErr.error(error);
        }
    }
    
    async deleteProdByCartId(id,id_prod) {
        let producto = new Producto();
        try {
            let carro = await esquemaCarro.find({id:id})
            let carroArr = carro.find(obj => {
                return obj
            })
            let carroActual = carroArr.productos
            if (carroActual.find(i=> i.id == id_prod)) {
                let carroNuevo = carroActual.filter(i=> i.id !== id_prod);
                let doc = await esquemaCarro.findOneAndUpdate({ id },{productos: carroNuevo});    
                this.datos = carroNuevo
            } else {
                this.datos = { error: 'producto no existe en carro'}
            }
            return this.datos
        } catch (error) {
            loggerErr.error(error);
        }   
    }

    async sendUserCart(id) {
        try {
            let orden = [];
            let filtro = {id:id};
            let carro = await esquemaCarro.find(filtro)
            let carroArr = carro.find(obj => {
                return obj
            })
            let productoArr = carroArr.productos;
            const productoOrden = productoArr.map(item => {
                const container = {};
                container.name = item.name;
                container.qty = item.qty;
                return container;
            })
            orden.productos = productoOrden;
            orden.userdata = carroArr.data;
            orden.fyh = new Date().toLocaleString();
            orden.estado = 'Generada';
            orden.email = id;
            let cuentaOrden = await esquemaOrden.countDocuments({ isDeleted: false })
            orden.numero = cuentaOrden + 1
            let ordenNueva = new esquemaOrden(orden);
            await ordenNueva.save()
            let html = "<p style='color: blue;font-size:2rem'><a>Nuevo pedido de: " +  orden.email + "</a></p>"
            const carroHtml = orden.productos;
            carroHtml.forEach(producto => {
                let carroProd = 
                    "<p style='font-size:1.4rem'><a style='color: green;'>Nombre: " + 
                    producto.name + 
                    "</a> <a  style='color: red;'>Cantidad: " +
                    producto.qty +
                    "</a></p>";
                html = html + carroProd
            });
            const mailOptions = {
                from: 'Servidor Node',
                to: adminEth,
                subject: 'Nueva compra en servidor',
                html: html
            };
            const info = await transporter.sendMail(mailOptions)
        } catch (error) {
            loggerErr.error(error);
        }        
    }


};

module.exports = Carrito;