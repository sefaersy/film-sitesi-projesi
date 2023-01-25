const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');


const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const bodyParser = require('body-parser')
app.use(expressLayouts);
app.use(express.static('public'));
app.use(express.static('yonetim_public'));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, './src/views'));

require('./src/config/database');
const MongoDBStore = require('connect-mongodb-session')(session);


const sessionStore = new MongoDBStore({
    uri: process.env.MONGODB_CONNECTION_STRING,
    collection: 'sessions'
});

app.use(session( {
    secret : process.env.SESSION_SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        maxAge : 1000000
    },
    store: sessionStore
}
));

app.use(flash());

app.use((req, res, next) => {
    res.locals.validation_error = req.flash('validation_error');
    res.locals.success_message = req.flash('success_message');
    res.locals.email = req.flash('email');
    res.locals.ad = req.flash('ad');
    res.locals.soyad = req.flash('soyad');
    res.locals.sifre = req.flash('sifre');
    res.locals.resifre = req.flash('resifre');

    res.locals.login_error = req.flash('error');


    next();
})

app.use(passport.initialize());
app.use(passport.session());


const authRouter = require('./src/routers/auth_router');
const yonetimRouter = require('./src/routers/yonetim_router');
const subscribeRouter = require('./src/routers/subscribe_router');
const creditRouter = require('./src/routers/credit_router');


app.use(express.urlencoded({ extended: true }));



app.get('/', (req, res) => {
    res.json({ mesaj : 'Merhaba' });
})

app.use('/', authRouter);
app.use('/yonetim', yonetimRouter);
app.use('/abonelik', subscribeRouter);
app.use('/kredi', creditRouter);
app.use('/kiralanan', yonetimRouter);
app.use('/alinan', yonetimRouter);


app.listen(process.env.PORT, () => {
    console.log(`server ${process.env.PORT} portundan ayaklandi`);
});