# **Curso Backend**
## Tutor: Raúl Ahumada
#
## Camilo González
#

>Esta es la ***Entrega 21***.

>**Capas**
>>Modificaciones de servicios hacia carpeta */model.*
>
>**Configuraciones**
>>Se crean *development.env* y *production.env*, los cuales controlan la persistencia de los productos.
>
>**Persistencia**
>>La persistencia de los productos esta hecha en mongo y file:
>>>La clase constructora base de los DAOS esta en *model/DAOs/productos.js*.
>>>
>>>La clase factory esta en esta en *model/DAOs/productosFactory.js*.
>>
>>>**MONGO**\
>>>Corre con
>>>>npm run prod
>>>
>>>DAO se encuentra en *model/DAOs/productosMongo.js*
>>>
>>>Api disponible en *api/productos.js*
>>
>>>**FILE**\
>>>Corre con
>>>>    npm run dev
>>>
>>>DAO se encuentra en *model/DAOs/productosFile.js*.
>>>
>>>Archivo de persistencia en *api/productos.txt*
>>
>**Router**
>>Nuevo Router routerProds que controla los productos en *routers/routerProds.js*
>>
>>>GET de /api/productos/        listado de productos
>>>
>>>GET de /api/productos/:id     producto por id
>>>
>>>POST de /api/productos/       ingresar un nuevo producto
>>>
>>>PUT de /api/productos/:id     modificar un producto por id
>>>
>>>GET de /api/productos/:id     orracto un producto por id

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

EJPUTPROD
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
