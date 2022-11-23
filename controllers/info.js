const {logger} = require('../config/logger.js')

async function getInfoController(req, res) {
    logger.info(`ruta '/info${req.url}' metodo '${req.method}'`);
    try {
        res.render('info.pug')
    } catch (error) {
        res.json(error)
    }
}

module.exports = getInfoController