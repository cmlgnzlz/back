# **Curso Backend**
## Profesor: Guillermo Fergnani
## Tutor: Raúl Ahumada
#
## Camilo González
#

>Esta es el ***Proyecto Final***.
>>
>>Cuenta admin:  user:admin@admin pass:admin
>>
>>Cuenta para etherealmail (correo de ordenes): user:daphnee92@ethereal.email pass:tA5SUyqUya9ZhhpAHc
>>
>**Productos**
>>El API RESTful de productos, cuenta con Factory, clase constructora base, controllers, y api.\
>>El manejo de los productos se realiza via POSTMAN:
>>>GET de /productos/:id     producto por id
>>>
>>>POST de /productos/       ingresar un nuevo producto
>>>
>>>PUT de /productos/:id     modificar un producto por id
>>>
>>>DELETE de /productos/:id  borrar producto por id
>>
>>El GET de /productos/ genera la vista al usuario una vez ingresado.
>>
>>La ruta /productos/categoria/:cat, devuelve una vista de los productos filtrados por la categoria. Esta rutapuede ser accedida mediante los botones del navbar.
>>
>>En la vista de ruta /productos/ podremos agregar el item solicitado.Esta redirige a /carrito/, habiendo agregado 1 unidad del producto al carrito del usuario.
>
>**Carrito**
>>La ruta /carrito/ genera una vista del contenido del carrito.
>>La vista tambien contiene botones para:
>>>Comprar: para enviar la orden del carrito\
>>>Ver productos: Para volver a la seccion de productos a agregar uno nuevo.\
>>>Modificar carro: Redirigue a /carrito/:id, genera una vista para que el usuario modifique su carro.
>>>>En esta vista se modifican las cantidades del producto, o simplemente se elimina. Ambas acciones redirigen a /carrito/.
>
>**Ordenes**
>>Al clickear en el boton de compra en el carrito, se envia la orden al correo de admin y correo de usuario con detalles de la orden. Luego redirige a la pagina principal de productos.
>
>**Colecciones**.
>>En la DB existen colecciones para:
>>>usuarios\
>>>productos\
>>>mensajes\
>>>carritos\
>>>ordenes
>
>**Configuraciones**
>>*development.env* y *production.env*, controlan los ambientes del servidor, siendo posible modificar las propiedades para poseer diferentes configuraciones.
>>
>>En la carpeta config. estan las configuraciones de passport, quien maneja las sesiones utilizando cookie-session. Tambien están el schema de usuario, la configuracion de logger y la estrategia que se utiliza.
>
>**Chat**
>>En la ruta /chat/ se genera la vista del chat general, donde cualquier usuario puede enviar sus mensajes.
>>
>>En la vista hay un boton para ir al chat privado.
>>Este redirige a la ruta /chat/:id, siendo el id el correo del usuario en sesion.
>>
>>Para el admin, la ruta le genera una vista de los usuarios con preguntas disponibles.
>>
>>El unico usuario que puede enviar mensajes en esta vista es el admin@admin.
>>
>>La respuesta generada y tambien cualquier mensaje que envie el admin@admin tendra como tipo "sistema", mientras que los mensajes del resto tendra tipo "usuario".



