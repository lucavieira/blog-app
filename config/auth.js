const local_strategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

require('../models/User')

const User = mongoose.model('users')

module.exports = function(passport) {
    passport.use(new local_strategy({usernameField: 'email'}, (email, password, done) => {
        User.findOne({email: email}).then(user => {
            if(!user) {
                return done(null, false, {message: 'This acount not exists'})
            }

            bcrypt.compare(password, user.password, (error, success) => {
                if(success) {
                    return done(null, user)
                } else {
                    return done(null, false, {message: 'Password is not correct'})
                }
            })
        })
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (error, user) => {
            done(error, user)
        })
    })
}