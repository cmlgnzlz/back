const { optionsMDB } = require("./options/options");
const { optionsSQLite } = require("./options/options");
const knexMDB = require("knex")(optionsMDB);
const knexSQLite = require("knex")(optionsSQLite);

///////////////////////////////////////
////////////////MARIADB////////////////
///////////////////////////////////////

/* knexMDB.schema
  .createTable("productos", (table) => {
    table.increments("id"), 
    table.string("name"), 
    table.integer("price");
    table.integer("qty");
    table.string("img");
  })
  .then(() => {
    console.log("todo bien");
  })
  .catch((err) => {
    console.log(err);
    throw new Error(err);
  })
  .finally(() => {
    knexMDB.destroy();
  }); */
  
/*   const productos =   [
    {
     "id": 1,
     "name": "Mihai",
     "price": 29,
     "qty": 100,
     "img": "http://localhost:8080/public/images/1.jpg"
    },
    {
     "id": 2,
     "name": "Quimera",
     "price": 32,
     "qty": 33,
     "img": "http://localhost:8080/public/images/2.jpg"
    },
    {
     "id": 3,
     "name": "Nergüi",
     "price": 29,
     "qty": 21,
     "img": "http://localhost:8080/public/images/3.jpg"
    },
    {
     "id": 4,
     "name": "Codie",
     "price": 35,
     "qty": 44,
     "img": "http://localhost:8080/public/images/4.jpg"
    },
    {
     "id": 5,
     "name": "Adisa",
     "price": 39,
     "qty": 11,
     "img": "http://localhost:8080/public/images/5.jpg"
    }
   ]

  
  knexMDB("productos")
   .insert(productos)
   .then((res)=>console.log(res))
   .catch((e)=>console.log(e))
   .finally(()=>knexMDB.destroy()) */

/*knexMDB("productos")
  .select("*")
  .orderBy("qty","asc")
  .then((res)=>console.log(res))
  .catch((e)=>console.log(e))
  .finally(()=>knexMDB.destroy()) */

///////////////////////////////////////
////////////////SQLITE////////////////
///////////////////////////////////////


/* knexSQLite.schema
  .createTable("mensajes", (table) => {
    table.string("mail"), 
    table.string("msg"), 
    table.string("stamp");
  })
  .then(() => {
    console.log("todo bien");
  })
  .catch((err) => {
    console.log(err);
    throw new Error(err);
  })
  .finally(() => {
    knexSQLite.destroy();
  }); */

/* const chat =   [
    {
      "mail": "camilo@dfc.com",
      "msg": "Hola!!",
      "stamp": "20-08-2022, 13:35:48"
    },
    {
      "mail": "gonzalo@dfc.com",
      "msg": "buenas",
      "stamp": "20-08-2022, 14:51:44"
    },
    {
      "mail": "vicente@dfc.com",
      "msg": "buenas tardes como estan",
      "stamp": "20/8/2022, 15:04:17"
    }
  ]
   
knexSQLite("mensajes")
   .insert(chat)
   .then((res)=>console.log(res))
   .catch((e)=>console.log(e))
   .finally(()=>knexSQLite.destroy()) */
   
/* knexSQLite("mensajes")
  .select("*")
  .orderBy("stamp","desc")
  .then((res)=>console.log(res))
  .catch((e)=>console.log(e))
  .finally(()=>knexSQLite.destroy()) */

/* knexSQLite
  .schema
  .dropTable("chat")
  .catch((e)=>console.log(e))
  .finally(()=>knexSQLite.destroy()) */

/*   knexSQLite("chat")
  .select("*")
  .orderBy("stamp","desc")
  .then((res)=>datos = res)
  .catch((e)=>console.log(e))
  .finally(()=>knexSQLite.destroy()) */

  let datos = await knexSQLite("mensajes")
  .select("*")
  .orderBy("stamp","desc")
  .then((res)=>datos = res)
  .catch((res)=>console.log(res))
  .finally(()=>knexSQLite.destroy())

  console.log(datos)

