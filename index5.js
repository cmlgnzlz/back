fs.promises
  .readFile("./text12.txt", "utf-8")
  .then((res) => {
    console.log(res);
  })
  .catch((e) => {
    console.log("hubo un error");
    console.log(e);
  });