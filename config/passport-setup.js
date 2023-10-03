const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const keys = require('./keys')
const User = require('../models/user-model')
//whenever user is logged in user id is stored in user session,typically
passport.serializeUser((user, done) => {
    done(null, user.id)
})
//gets user id from the session,and adds user to the user request object
passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user)
    })
})

passport.use(new GoogleStrategy(
    //options for google strategy
    {
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: 'http://localhost:3000/auth/google/redirect'

    }, async (accessToken, refreshtoken, profile, done) => {
        //check if user exists
        // User.findOne({ googleID: profile.id }).then(user => {
        //     if (!user) {
        //         new User({
        //             username: profile.displayName,
        //             email: profile.emails[0].value,
        //             googleID: profile.id
        //         }).save().then(user => {
        //             console.log("user created " + user)
        //             done(null, user)
        //         })
        //     } else {
        //         done(null, user)
        //     }

        // })
        let user = await User.findOne({ googleID: profile.id });

        if (!user) {
            user = await new User({
                username: profile.displayName,
                email: profile.emails[0].value,
                googleID: profile.id
            }).save();
            console.log("User created", user);
        }

        done(null, user);

        console.log('passport callback function fired')
    }))