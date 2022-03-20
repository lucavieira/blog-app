const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/User')
const user = mongoose.model('users')


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
        //Next lesson
    }
})

module.exports = router