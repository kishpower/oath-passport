const express = require('express')
const authRoutes = require('./routes/auth-routes')
const app = express()
const passportSetup = require('./config/passport-setup')
const mongoose = require('mongoose')
const keys = require('./config/keys')
const cookieSession = require('cookie-session')
const passport = require('passport')
const profileRoutes = require('./routes/profile-routes')

app.set('view engine', 'ejs')
app.use(cookieSession({
    maxAge: 1000 * 60 * 60 * 24,
    keys: [keys.cookie.key]
}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/auth', authRoutes)
app.use('/profile', profileRoutes)

mongoose.connect(keys.mongoDB.URI).then(() => {
    console.log("connected to mongodb!");
}, err => {
    console.error(err);
})

app.get('/', (req, res) => {
    res.render('home', { user: req.user })
})
app.listen(3000, () => {
    console.log("listening on 3000")
})