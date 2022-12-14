# **Curso Backend**
## Tutor: Raúl Ahumada
#
## Camilo González
#

>Esta es la ***Entrega 22***.

>**GraphQL**
>>Ruta [/api/productos](http://localhost:5000/api/productos/) funcional con graphiQL
>>Schema de productos Disponible en *models/schema.js*
>
>**Persistencia**
>>La persistencia de los productos esta hecha en file:
>>>Disponible en *api/productos.js*
>
>**Funciones**
>>Las funciones getProds,getProdById,postProd,putProd,deleteProd fueron adaptadas para funcionar con graphQL
>>>Disponible en *controllers/productos.js*

>**Ejemplo de funciones**

EJ GETPRODS
query {
 getProds{
  name
  id
 }
}

EJ GETPRODBYID
query {
 getProdById(id:3) {
  name
  id
 }
}

EJ POSTPROD
mutation {
 postProd(datos: {
  	name: "Mijail",
    price: 330,
    qty: 21,
    img: "/public/images/5.jpg",
    desc: "Hola"  
 })
{
  id
  name
}
}

EJ PUTPROD
mutation {
 putProd(id:"3", 
  datos: {
  	name: "Mijail",
    price: 330,
    qty: 21,
    img: "/public/images/5.jpg",
    desc: "Hola"  
 })
{
  id
  name
  price
  qty
}
}

EJ DELETEPROD
mutation {
  deleteProd(id: "8") {
    id
    name
    price
  }
}