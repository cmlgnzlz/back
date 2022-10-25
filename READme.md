# **Curso Backend**
# Entrega 15
#
## Camilo González
## Tutor: Raúl Ahumada
#

>Esta es la entrega ***15***.

>**NGINX con cluster PM2**\
>Captura de procesos funcionando en */public/images*\
>Para iniciar server:
>>Usando CMD , dentro de carpeta /NginxNode/public/
>>>**localhost:80**\
Para iniciar fork:\
pm2 start server.js --name="Server1" --watch -- 8080\
>>
>>>**localhost:80/api/randoms/**\
Para iniciar cluster:\
pm2 start server.js --name="Server2" --watch -i max -- 8082\
pm2 start server.js --name="Server3" --watch -i max -- 8083\
pm2 start server.js --name="Server4" --watch -i max -- 8084\
pm2 start server.js --name="Server5" --watch -i max -- 8085