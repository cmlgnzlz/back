const admin = require("firebase-admin");
const serviceAccount = require("./bd/fireback-addcb-firebase-adminsdk-w2tqk-52c47a4269.json");
const Producto = require('./productosDaos');


class Carro{

    constructor() {
        this.datos = [];
        this.byId = {};
        this.carro = {};
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
          });
    }

    async saveNewCart() { 
        try {
            let db = admin.firestore();
            let query = db.collection('carritos');
            let snapshot = await query.get();
            let cuenta = snapshot.size;
            let id = cuenta+1;
            let stamp = new Date().toLocaleString();
            let productos = [];
            let carro = {id:id,stamp:stamp,productos:productos};
            let doc = query.doc(`${id}`);
            let carroVa = await doc.create(carro);
            this.carro = carro;
        } catch (error) {
            console.log(error);
        }
    }

    async deleteCartById(id) {
        try {
            let db = admin.firestore();
            let verBorrar = await db.collection('carritos').doc(id).get();
            this.carro = verBorrar.data();
            let borrar = await db.collection('carritos').doc(id).delete();
        } catch (error) {
            console.log(error);
        }
    }
    
    async getByCartId(id){
        try {
            let db = admin.firestore()
            let query = db.collection('carritos')
            let doc = query.doc(id)
            let carro = await doc.get()
            let carroData = carro.data()
            this.carro = carroData
        } catch (error) {
            console.log(error.message);
        }
    }

    async addProdByCartId(id,id_prod) {
        const producto = new Producto();
        try {
            let db = admin.firestore();
            let query = db.collection('carritos');
            let doc = query.doc(String(id));
            let productoAdd = await producto.getById(id_prod);
            let productoAddJson = JSON.stringify(productoAdd);
            const item = await doc.update({
                productos: admin.firestore.FieldValue.arrayUnion(productoAddJson)
            });
            let carro = await doc.get();
            let carroData = carro.data();
            this.carro = carroData;            
        } catch (error) {
            console.log(error.message);
        }
        
    }
    
    async deleteProdByCartId(id,id_prod) {
        const producto = new Producto();
        try {
            let db = admin.firestore()
            let query = db.collection('carritos');
            let doc = query.doc(String(id));
            let productoAdd = await producto.getById(id_prod);
            let productoAddJson = JSON.stringify(productoAdd);
            const item = await doc.update({
                productos: admin.firestore.FieldValue.arrayRemove(productoAddJson)
            })
            let carro = await doc.get();
            let carroData = carro.data();
            this.carro = carroData;    
        } catch (error) {
            console.log(error.message);
        }   
    }
};

module.exports = Carro;