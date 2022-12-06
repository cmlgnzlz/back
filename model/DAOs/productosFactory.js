const ProductoFileDAO = require('./productosFile')
const ProductoMongoDAO = require('./productosMongo')
class productosFactory {
    static get(tipo) {
        switch (tipo) {
            case "FILE":
                return new ProductoFileDAO();
            case "MONGO":
                return new ProductoMongoDAO();
        }
    }
}
module.exports = productosFactory;