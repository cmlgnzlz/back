const fs = require("fs")

class Contenedor{

    constructor(nombreArchivo) {
        this.nombreArchivo = nombreArchivo
    }
    
    async save(product) {
        try {
            let datos = await fs.promises.readFile(this.nombreArchivo,"utf-8")
            let datosJson = await JSON.parse(datos)
            if (datosJson.length>0){
                const ordenId = datosJson.map(i=>i.id).sort()
                product.id= ordenId.length+1
                datosJson.push(product)
                fs.promises.writeFile(this.nombreArchivo, JSON.stringify(datosJson, null, 1))
                console.log("Producto agregado")
            }
            else{
                console.log("Vacio")
                let datosJson = [];
                product.id = 1;
                console.log(product.id)
                datosJson.push(product)
                fs.promises.writeFile(this.nombreArchivo, JSON.stringify(datosJson, null, 1))
            }
        } catch (error) {
            console.log(error)
        }
    }

    async getById(id) {
        try {
            let datos = await fs.promises.readFile(this.nombreArchivo,"utf-8")
            let datosJson = await JSON.parse(datos)
            if(datosJson.find(i=>i.id === id)){
                console.log(datosJson.find(i=>i.id === id))
            }
            else{
                console.log("No existe elemento con esa ID")
            }
                
        } catch (error) {
            console.log(error)
        }
    }

    async getAll(){
        try {
            let datos = await fs.promises.readFile(this.nombreArchivo,"utf-8")
            let datosJson = await JSON.parse(datos)
            console.log(datosJson)
        } catch (error) {
            console.log(error)
        }
    }

    async deleteById(id) {
        try {
            let datos = await fs.promises.readFile(this.nombreArchivo,"utf-8")
            let datosJson = await JSON.parse(datos)
            if (datosJson.find(i=>i.id === id)){
                let borrarId = datosJson.find(i=>i.id === id)
                let posicionId = datosJson.indexOf(borrarId)
                datosJson.splice(posicionId,1)
                fs.promises.writeFile(this.nombreArchivo, JSON.stringify(datosJson, null, 1))
                console.log("ID eliminado")
            } else{
                console.log("No existe elemento con esa ID")
            }
        } catch (error) {
            console.log(error)
        }
    }

    async deleteAll() {
        try {
            fs.promises.writeFile(this.nombreArchivo, [])
            console.log("Todo ha sido eliminado.")
        } catch (error) {
            console.log(error)
            
        }
    }
};

let nuevoProducto = {name:'Nālani', price:'$39.990', qty:'09'}

const producto= new Contenedor("productos.txt")

//producto.save(nuevoProducto)
//producto.getById('5')
//producto.getAll()
//producto.deleteById('1')
//producto.deleteAll()