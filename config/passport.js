const passport = require('passport');
require('./strategies/local.strategy')();
const esquemaUser = require('./models/schemaUser');

const passportConfig = (app) => {
    app.enable('trust proxy'); 
    app.use(require('cookie-session')({ 
        secret: process.env.SECRETO, 
        cookie: {
            httpOnly: false,
            secure: (process.env.NODE_ENV && process.env.NODE_ENV == 'production') ? true:false,
            maxAge: 600000,
        },
        resave: true,
        saveUninitialized: true,
        proxy: true,    
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done) => {
    done(null, user);
    });

    passport.deserializeUser((username, done) => {
    esquemaUser.findById(username, done);
    });
};

module.exports = passportConfig;