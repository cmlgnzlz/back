const fs = require("fs")

try {
    const tyh = new Date().toString();
    fs.appendFileSync("./fyh.txt",tyh)    
} catch (error) {
    console.log("ha habido un error")
}


