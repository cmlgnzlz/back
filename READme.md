# **Curso Backend**
# Segunda Entrega Proyecto Final
## Camilo González
## Tutor: Raúl Ahumada
#


>***Implementacion de rutas***\
>Nueva carpeta de routers: **/routers/**\
>Se modifican metodos a estos routers de acuerdo a las instrucciones.\
>Funciones probadas en Postman.

>**DAOS**
>Carpeta incorporada: **/daos/**\
>Nuevos archivos: mainDaos,carroDaos,productoDaos.

>
>**MongoDB**\
>Se utiliza para el router productos:\
>Esquema de productos en **/daos/models/**\
>Rutas implementadas:\
>GET http://localhost:8080/api/productos/\
>GET http://localhost:8080/api/productos/:id\
>POST http://localhost:8080/api/productos/ \
>PUT http://localhost:8080/api/productos/:id \
>DELETE http://localhost:8080/api/productos/:id 


>**Firebase**\
>Se utiliza para el router carrito:\
>Archivo de config en **/daos/bd/**\
>Rutas implementadas:\
>POST http://localhost:8080/api/carrito/ \
>DELETE http://localhost:8080/api/carrito/:id \
>GET http://localhost:8080/api/carrito/:id/productos/ \
>POST http://localhost:8080/api/carrito/:id/productos/:id \
>DELETE http://localhost:8080/api/carrito/:id/productos/:id
