const productos=[
    {id: 1,name: "Mihai",price: 29.9, qty: 100},
    {id: 2,name: "Quimera",price: 32.9,qty: 33},
    {id: 3,name: "Nergüi",price: 29.9,qty: 21},
    {id: 4,name: "Codie",price: 35.9,qty: 44},
    {id: 5,name: "Adisa",price: 39.9,qty: 11}
]

const nombres = (productos)=>{
    let aux;
    let precioTotal;
    let promedio;
    let menor=999;
    productos.forEach(element => {
        console.log(element)
        if (menor>element.price){
            menor=element.price;
            console.log(menor)
        } else{
            console.log("no es menor")
        }
    });
    console.log(menor)
}

nombres(productos)