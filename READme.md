# **Curso Backend**
# Primera Entrega Proyecto Final
## Camilo González
## Tutor: Raúl Ahumada
#

>***Implementacion de variable admin***\
>En *server.js*: Implementacion de variable booleana para verificacion de privilegios.\
>Valor de variable predeterminada en true.
>
>***Implementacion de rutas***\
>Se agregan 2 routers.\
>Se aplican metodos a estos routers de acuerdo a las instrucciones.\
GET http://localhost:8080/api/productos/\
GET http://localhost:8080/api/productos/:id\
POST http://localhost:8080/api/productos/ (solo admin)\
PUT http://localhost:8080/api/productos/:id (solo admin)\
DELETE http://localhost:8080/api/productos/:id (solo admin)
>
>***Implementacion de metodos en endpoints***\
>En *server.js*: Implementacion de funciones para endpoints y metodos solicitados en rutas especificadas.\
>Funciones:getAll,getById,save,updateById,deleteById.
>
>***Implementacion de carro***\
>Agrega nueva propiedad a constructor this.carro.\
>Agrega carro.txt para persistencia de los carros.\
>En *server.js*: Implementacion de funciones para endpoints y metodos solicitados.\
>Nuevas funciones: saveNewCart,deleteCartById,getByCartId,addProdByCartId,deleteProdByCartId.\
>Funcionalidad de carro probada en Postman.\
>POST http://localhost:8080/api/carrito/ \
>DELETE http://localhost:8080/api/carrito/:id \
>GET http://localhost:8080/api/carrito/:id/productos/ \
>POST http://localhost:8080/api/carrito/:id/productos/:id \
>DELETE http://localhost:8080/api/carrito/:id/productos/:id
>
> **_Glitch_**\
> https://funky-northern-thunder.glitch.me/ \
> Metodo GET para los endpoint:\
>https://funky-northern-thunder.glitch.me/api/productos/ \
>https://funky-northern-thunder.glitch.me/api/productos/:id \
>https://funky-northern-thunder.glitch.me/api/carrito/:id\
>*funcionando*
#