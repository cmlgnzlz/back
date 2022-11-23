const admin = require("firebase-admin");
const serviceAccount = require("../api/bd/fireback-addcb-firebase-adminsdk-w2tqk-52c47a4269.json");
const twilio = require("twilio");
const accountSid =  'AC944b2ed8bb6d2d149139ecacffdc0d48';
const authToken = process.env.TWILIO;
const client = twilio(accountSid, authToken);

const {loggerErr} = require('../config/logger')


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

const nodemailer = require("nodemailer")
const adminEth = 'margaretta.oconnell38@ethereal.email'
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

    async newCart() {
        try {
            let db = admin.firestore();
            let query = db.collection('carritos');
            let snapshot = await query.get();
            let cuenta = snapshot.size;
            let id = cuenta+1;
            let productos = [];
            let carro = {id:id,productos:productos};
            this.carro = carro;
        } catch (error) {
            loggerErr.error(error);
        }  
    }

    async saveNewCart(userData) { 
        try {
            let db = admin.firestore();
            let query = db.collection('carritos');
            let id = userData.carroId;
            let data = {};
            data.username = userData.username
            data.nombre = userData.nombre;
            data.edad = userData.edad;
            data.telefono = userData.telefono;
            data.direccion = userData.direccion;
            let productos = [];
            let carro = {id:id,data:data,productos:productos};
            let doc = query.doc(`${id}`);
            let carroVa = await doc.create(carro);
            this.carro = carro;
            const mailOptions = {
                from: 'Servidor Node',
                to: adminEth,
                subject: 'Nuevo registro en servidor',
                html: `<div><p style="color: blue;font-size:2rem">Nuevo registro de:</p><p style="color: red;font-size:1.4rem">correo:${data.username}</p><p style="color: red;font-size:1.4rem">nombre:${data.nombre}</p><p style="color: red;font-size:1.4rem">direccion:${data.direccion}</p><p style="color: red;font-size:1.4rem">edad:${data.edad}</p><p style="color: red;font-size:1.4rem">telefono:${data.telefono}</p><p style="color: red;font-size:1.4rem">carrito:${id}</p></div>`
             }
             const info = await transporter.sendMail(mailOptions)
        } catch (error) {
            loggerErr.error(error);
        }
    }

    async saveAvatar(id,aPath){
        try {
            let db = admin.firestore();
            let query = db.collection('carritos');
            let doc = query.doc(String(id));
            const item = await doc.update({
                avatar: admin.firestore.FieldValue.arrayUnion(aPath)
            });
        } catch (error) {
            loggerErr.error(error);
        }
    }

    async deleteCartById(id) {
        try {
            let db = admin.firestore();
            let verBorrar = await db.collection('carritos').doc(id).get();
            this.carro = verBorrar.data();
            let borrar = await db.collection('carritos').doc(id).delete();
        } catch (error) {
            loggerErr.error(error);
        }
    }
    
    async getByCartId(id){
        try {
            let db = admin.firestore();
            let query = db.collection('carritos');
            let doc = query.doc(id);
            let carro = await doc.get();
            let carroData = carro.data();
            this.carro = carroData
        } catch (error) {
            loggerErr.error(error);
        }
    }

    async getUserInfo(id){
        try {
            let db = admin.firestore();
            let query = db.collection('carritos');
            let doc = query.doc(String(id));
            let carro = await doc.get();
            let carroData = carro.data();
            console.log(carroData)
            this.carro = carroData.productos;
            this.userdata = carroData.data;
            let userAvat = carroData.avatar;
            let avatArr = userAvat.find(obj => {
                return obj
            });
            let avatString =`\\${avatArr}`;
            this.userdata.avatar = avatString;
            this.userdata.id = id;
            return this
        } catch (error) {
            loggerErr.error(error);
        }
    }

    async sendUserCart(id) {
        try {
            let db = admin.firestore();
            let query = db.collection('carritos');
            let doc = query.doc(String(id));
            let carro = await doc.get();
            let carroData = carro.data();
            this.carro = carroData.productos;
            this.userdata = carroData.data;
            this.userdata.id = id;
            let html = "<p style='color: blue;font-size:2rem'><a>Nuevo pedido de: " + this.userdata.username + "</p><p style='color: blue;font-size:1.6rem'><a>Id de carrito: " + this.userdata.id + "</a></p>"
            const carroHtml = this.carro;
            carroHtml.forEach(producto => {
                let carroProd = 
                    "<p style='font-size:1.4rem'><a style='color: green;'>Nombre: " + 
                    producto.name + 
                    "</a> <a style='color: blue;'>Precio: $" + 
                    producto.price +
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
             }
             const carroFono = "whatsapp:+"+this.userdata.telefono;
             const info = await transporter.sendMail(mailOptions)
             let whapp = "Nuevo pedido de: " + this.userdata.username + "\n"
             carroHtml.forEach(producto => {
                let carroProd = 
                    "Nombre: " + 
                    producto.name + 
                    "\nPrecio: $" + 
                    producto.price +
                    "\nCantidad: " +
                    producto.qty +
                    "\n\n";
                whapp = whapp + carroProd
            });
             const message = await client.messages.create({
                body: whapp,
                from: 'whatsapp:+14155238886',
                to: carroFono
             }) 
        } catch (error) {
            loggerErr.error(error);
        }        
    }
    async addProdByCartId(id,id_prod) {
        const producto = new Producto();
        try {
            let db = admin.firestore();
            let query = db.collection('carritos');
            let doc = query.doc(String(id));
            let productoAdd = await producto.getById(id_prod);
            const item = await doc.update({
                productos: admin.firestore.FieldValue.arrayUnion(productoAdd)
            });
            let carro = await doc.get();
            let carroData = carro.data();
            this.carro = carroData;            
        } catch (error) {
            loggerErr.error(error);
        }
        
    }
    
    async deleteProdByCartId(id,id_prod) {
        const producto = new Producto();
        try {
            let db = admin.firestore()
            let query = db.collection('carritos');
            let doc = query.doc(String(id));
            let productoAdd = await producto.getById(id_prod);
            const item = await doc.update({
                productos: admin.firestore.FieldValue.arrayRemove(productoAdd)
            })
            let carro = await doc.get();
            let carroData = carro.data();
            this.carro = carroData;    
        } catch (error) {
            loggerErr.error(error);
        }   
    }
};

module.exports = Carrito;