function func1(indiceDeExito) {
    console.log("exito!! " + indiceDeExito);
  }
  
  function func2(msg) {
    console.log("exploto todo" + msg);
  }
  
  function buscarElLibro(array, str, func1, func2) {
    let encontrado = false;
    let i = 0
    for (i; i < array.length; i++) {
      if (array[i] == str) {
        encontrado = true;
        break;
      }
    }
  
    if (encontrado == true) {
      func1(i + 1);
    } else {
      func2("Error!!! No esta!!");
    }
  }
  
  let arraydeLibros = ["frankestain", "dracula", "el lobo"];
  buscarElLibro(arraydeLibros, "dracula", func1, func2);