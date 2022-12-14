const { buildSchema } = require("graphql");

const schema = buildSchema(`
    type Producto {
        id: ID!
        name: String,
        price: Int,
        qty: Int,
        img: String,
        desc: String
    }
    input ProductoInput {
        name: String,
        price: Int,
        qty: Int,
        img: String,
        desc: String
    }
    type Query {
        getProds(campo: String, valor: String): [Producto],
        getProdById(id: ID!): Producto,
    }
    type Mutation {
        postProd(datos: ProductoInput): Producto
        putProd(id: ID!, datos: ProductoInput): Producto,
        deleteProd(id: ID!): Producto,
    }
`);

module.exports = schema