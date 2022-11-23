const passport = require('passport');
const { Strategy } = require('passport-local');
const bcrypt = require("bcrypt");   

const esquemaUser = require('../models/schemaUser');

function isValidPassword(user, password) {
    return bcrypt.compareSync(password, user.password);
}

function createHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

const localStrategy = () => {
    passport.use(
        "login",
        new Strategy((username, password, done) => {
            esquemaUser.findOne({ username }, (err, user) => {
                if (err) return done(err);
                if (!user) {
                    return done(null, false);
                }
                if (!isValidPassword(user, password)) {
                    return done(null, false);
                }
                return done(null, user);
            });
        })
    );
    
    passport.use(
        "signup",
        new Strategy(
            {
                passReqToCallback: true,
            },
            (req, username, password, done) => {
                esquemaUser.findOne({ username: username }, function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (user) {
                        return done(null, false);
                    }
                    const newUser = {
                        username: username,
                        password: createHash(password),
                        carrito: req.body.carroId
                    };
                    esquemaUser.create(newUser, (err, user) => {
                        if (err) {
                            return done(err);
                        }
                        return done(null, user);
                    });
                });
            }
        )
    );
}  

module.exports = localStrategy;