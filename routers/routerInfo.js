const Router = require('express'); 
const getInfoController = require('../controllers/info.js')

const routerInfo = new Router();

routerInfo.get('/', getInfoController)

module.exports = routerInfo