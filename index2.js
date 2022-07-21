function buscarElLibro(array, str, func) {
    let encontrado = false;
    let i = 0;
    for (i = 0; i < array.length; i++) {
      if (array[i] == str) {
        encontrado = true;
        break;
      }
    }
  
    if (encontrado == true) {
      func(null, i);
    } else {
      func(true, "No se encontro");
    }
  }
  
  let arraydeLibros = ["frankestain", "dracula", "el lobo"];
  
  function func1(myError, value) {
    if (myError) {
      console.log(value);
    } else {
      console.log("se encontro y salio todo bien: " + value);
    }
  }
  
  buscarElLibro(arraydeLibros, "dracula", (myError, value) => {
    if (myError) {
      console.log(value);
    } else {
      console.log("se encontro y salio todo bien: " + value);
    }
  });
  