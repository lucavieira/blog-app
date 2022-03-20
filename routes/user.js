const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/User')
const User = mongoose.model('users')
const bcrypt = require('bcryptjs')
const passport = require('passport')


router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', (req, res) => {
    let erros = []

    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null) {
        erros.push({texto: 'Invalid name'})
    }

    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        erros.push({texto: 'Invalid email'})
    }

    if(!req.body.password || typeof req.body.password == undefined || req.body.password == null) {
        erros.push({texto: 'Invalid password'})
    }

    if(req.body.password.length < 5) {
        erros.push({texto: 'Weak password'})
    }

    if(req.body.password != req.body.confirm_password) {
        erros.push({texto: 'Passwords do not match'})
    }

    if(erros.length > 0) {
        res.render('users/register', {erros: erros})
    } else {
        User.findOne({email: req.body.email}).then(user => {
            if(user){
                req.flash('error_msg', 'E-mail registered')
                res.redirect('/users/register')
            } else {
                const new_user = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                })

                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(new_user.password, salt, (erro, hash) => {
                        if(erro) {
                            req.flash('error_msg', 'Internal Error')
                            res.redirect('/')
                        } else {
                            new_user.password = hash

                            new_user.save().then(() => {
                                req.flash('success_msg', 'User registered')
                                res.redirect('/')
                            }).catch( error => {
                                req.flash('error_msg', 'User not registered')
                                res.redirect('/users/register')
                            })
                        }
                    })
                })
            }
        }).catch( error => {
            req.flash('error_msg', 'Internal Error')
            res.redirect('/')
        })
    }
})

router.get('/login', (req, res) => {
    res.render('users/login')
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})

module.exports = router