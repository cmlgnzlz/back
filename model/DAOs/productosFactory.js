const ProductoMongoDAO = require('./productosMongo')
class productosFactory {
    static get(tipo) {
        switch (tipo) {
            case "MONGO":
                return new ProductoMongoDAO();
        }
    }
}
module.exports = productosFactory;