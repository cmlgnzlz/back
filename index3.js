async function main() {
    let traerListadoDeAlumnos = () => {
      return new Promise((res, rej) => {
        setTimeout(() => {
          res(["juan", "maria", "pedro"]);
        }, 2 * 1000);
      });
    };
  
    //bloqueante
    const res = await traerListadoDeAlumnos();
    console.log(res);
    console.log("fin");
  
    //no bloqueante / async
    traerListadoDeAlumnos()
      .then((res) => {
        console.log(res);
      })
      .catch((e) => console.log(e));
    console.log("fin");
  }
  
  main();
  