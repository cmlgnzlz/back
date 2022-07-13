class Usuario{
    constructor(nombre,apellido,libros,mascotas){
        this.nombre = nombre;
        this.apellido = apellido;
        this.libros = libros;
        this.mascotas = mascotas;
        this.nombreLibros = []
    }
    getFullName(){
        return console.log(`El nombre completo del usuario es ${this.nombre} ${this.apellido}`)
    }
    addMascota(mascota){
        this.mascotas.push(mascota)
    }
    countMascotas(){
        return console.log(`Tiene ${this.mascotas.length} mascotas`)
    }
    addBook(libro){
        this.libros.push(libro)
    }
    getBookNames(){
        this.libros.forEach((libro) =>
            {this.nombreLibros.push(libro.nombre)}
        )
        console.log(this.nombreLibros)
    }
};

let usuario = new Usuario(
    'Vicente',
    'Oyarzun',
    [
        {nombre:'La Metamorfosis', autor:'Franz Kafka'},
        {nombre:'1984', autor:'George Orwell'},
        {nombre:'Fahrenheit 451', autor:'Ray Bradbury'}
    ],
    ['Pito Pablo','Lady','Laika','Tito','Zeus']
);

usuario.getFullName();
usuario.addMascota('Buzz');
usuario.countMascotas();
usuario.addBook({nombre:'Demonio', autor:'Roberto Ampuero'});
usuario.getBookNames()
