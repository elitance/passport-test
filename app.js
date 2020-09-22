const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const app = express();
app.use(express.urlencoded({ extended: true, inflate: true, limit: '100kb', parameterLimit: 1000, }))
app.use((req, res, next) => {
    console.log('Processing a request...');
    next();
});

app.use(session({
    secret: 'imsostupid',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

const auth = {
    email: 'ldhan0715@gmail.com',
    password: 'password'
};

passport.use(new LocalStrategy({
    usernameField: 'un',
    passwordField: 'pw'
}, (un, pw, done) => {
    console.log('passport.use');
    debugger;
    if (un === auth.email && pw === auth.password) {
        return done(null, auth);
    } else {
        return done(null, false, { message: 'Incorrect Email or Password' });
    }
}));

passport.serializeUser((user, done) => {
    console.log('passport.serializeUser');
    return done(null, user.email);
});

passport.deserializeUser((email, done) => {
    console.log('passport.deserializeUser');
    return done(null, email);
})

app.post('/login', (req, res, next) => { 
    debugger;
    next();
}, passport.authenticate('local', {
    successRedirect: '/success',
    failureRedirect: '/'
}));

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
        <head>
            <title>Login Test</title>
            <meta charset="utf-8">
        </head>
        <body>
            <form action="/login" method="POST">
                <input type="text" name="un" value="ldhan0715@gmail.com"><br>
                <input type="password" name="pw" value="password">
                <input type="submit">
            </form>
        </body>
    </html>
    `);
});

app.get('/success', (req, res) => {
    res.send('Login success!');
})

app.listen(5506, () => {
    console.log('Test app started on: localhost:5506');
});