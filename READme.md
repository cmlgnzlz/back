# **Curso Backend**
# Tercera Entrega del Proyecto Final
#
## Camilo González
## Tutor: Raúl Ahumada
#

>Esta es la ***Tercera Entrega del Proyecto Final***.

>**Formulario de Registro**\
>El menu de registro funciona en 2 pasos\
>Solicita informacion mediante formulario.
>>GET a /signup, utiliza newCart, en linea 250 de index.js, para calcular el numero de carrito a utilizar, e incorporarlo dentro del form a postear.\
>>POST a /signup, utiliza saveNewCart con los datos del formulario, para registrar la informacion del usuario.\
>Para efectos de mensajeria whatsapp, el formulario solicita un telefono de al menos 11 caracteres.
>
>Luego solicita subir una foto
>>GET a /subidor que renderea *subidor.pug*.\
>>POST a /subidor que usa funcion *saveAvatar*, en linea 293 de index.js\
>Luego de registrado se redirigue a pagina principal.

>**Formulario de Login**\
>Solicita usuario y contraseña mediante formulario.
>>GET a /login renderea *login.pug*\
>>POST a /login/ utiliza getUserInfo, en linea 330 de index.js, y redirige al index.

>**Carrito**
>>GET /api/carrito/ utiliza getUserInfo usando el id del carrito, y muestra la vista del carrito disponible en *carrito.pug*.\
>>POST /api/carrito/ utiliza sendUserCart, en linea 352 de index.js, enviando con nodemailer y twilio.
>
>> POST /api/carrito/:id/productos/:id_prod agrega el producto de id_prod, al carrito id
>> DELETE /api/carrito/:id/productos/:id_prod elimina el producto de id_prod, del carrito id

>**Nodemailer**\
>Configuracion desde linea 138 en index.js.
>
>Envia correo luego del registro de un nuevo usuario\
>Ejemplo de correo: https://ethereal.email/message/Y3Kuz-dSuGr8-ZDBY3LOqxwMklBUP8-pAAAADBuqUMSzZltl25KgHj2KRm0 \
>Utilizado en saveNewCart, desde linea 266 en index.js.
>
>Envia correo luego del registro de una nueva compra\
>Ejemplo de correo: https://ethereal.email/message/Y3Kuz-dSuGr8-ZDBY3LO7dlA5-huhR82AAAADYiwpFnX-K309vR-kZXO7Cw \
>Utilizado en sendUserCart, desde linea 354 en index.js.

>**Twilio**\
>Configuracion desde linea 149 en index.js.\
>Envia mensaje luego del registro de una nueva compra.\
>Ejemplo de mensaje recibido en carpeta /public/

>**Pruebas con Artillery**\
>Logs disponibles: result_fork.txt y result_cluster.txt\
>*fork*
>>node server.js\
>>artillery quick --count 50 -n 40 http://localhost:5000/api/carrito > result_fork.txt   
>
>*cluster*
>>pm2 start index.js --name="Server2" --watch -i max --\
>>artillery quick --count 50 -n 40 http://localhost:5000/api/carrito > result_cluster.txt\
>
>El modo cluster con pm2 pudo procesar mas del doble de request que el servidor lanzado con node server.js

