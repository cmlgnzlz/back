const Router = require('express'); 
const passport = require("passport");
const {getLogin, postSignup, getSignup, failSignup, failLogin, getLogout, subidor} = require("../controllers/productos")
const routerDatos = new Router();

const multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
});
var upload = multer({ storage: storage });

function auth(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } 
    else {
        res.redirect("/");
    }
}

routerDatos.get("/", auth, getLogin);
routerDatos.post("/", passport.authenticate("login", { failureRedirect: "/login/failogin" }), getLogin);
routerDatos.post("/signup", passport.authenticate("signup", { failureRedirect: "/login/failsignup" }), postSignup);
routerDatos.get("/signup", getSignup);
routerDatos.get("/failsignup", failSignup);
routerDatos.get("/failogin", failLogin);
routerDatos.get("/logout", getLogout);
routerDatos.get('/subidor', (req, res) => {res.render('subidor.pug')});
routerDatos.post('/subidor', upload.single('avatar'), subidor);

module.exports = routerDatos;