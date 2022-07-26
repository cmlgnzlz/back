const moment = require("moment")

let hoy = moment()
let bornday= moment("19891020", "YYYYMMDD")
let years = hoy.diff(bornday,"years")
let days= hoy.diff(bornday,"days")

console.log(years)
console.log(days)