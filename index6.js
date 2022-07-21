async function main() {
    try {
      const data = await fs.promises.readFile("./text1.txt", "utf-8");
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  }
  
  main();
  