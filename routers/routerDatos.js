const Router = require('express'); 
const passport = require("passport");
const { getLogin, postSignup, getSignup, failSignup, failLogin, getLogout, getChat } = require("../controllers/datos");
const { carritoSucc } = require("../controllers/carro");
const routerDatos = new Router();

function auth(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } 
    else {
        res.redirect("/");
    }
}

routerDatos.get("/login", auth, getLogin);
routerDatos.post("/login", passport.authenticate("login", { failureRedirect: "/login/failogin" }), getLogin);
routerDatos.post("/login/signup", passport.authenticate("signup", { failureRedirect: "/login/failsignup" }), postSignup);
routerDatos.get("/login/signup", getSignup);
routerDatos.get("/login/failsignup", failSignup);
routerDatos.get("/login/failogin", failLogin);
routerDatos.get("/login/logout", getLogout);
routerDatos.get("/carritosuccess", carritoSucc);
routerDatos.get("/chat/", getChat)

module.exports = routerDatos;