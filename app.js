// Modulos utilizados
const express = require('express')
const handlebars = require('express-handlebars')
const body_parser = require('body-parser')
const app = express()
const admin = require('./routes/admin')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')

// Config's
    // Session
        app.use(session({
            secret: 'cursodenode',
            resave: true,
            saveUninitialized: true
        }))

        app.use(flash())
    // Middleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash('success_msg')
            res.locals.error_msg = req.flash('error_msg')
            next()
        })
    // body-parser
        app.use(body_parser.urlencoded({extended: true}))
        app.use(body_parser.json())
    // handlebars
        app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars')
    // Mongoose
        mongoose.connect('mongodb://localhost/blogapp').then(() => {
            console.log('Conectado ao banco')
        }).catch(error => {
            console.log('Error ao se conectar. ' + error)
        })
    // Public
        app.use(express.static(path.join(__dirname, 'public')))
// Routes
    app.get('/', (req, res) => {
        res.send('Coming soon...')
    })
    app.use('/admin', admin)
// Others
const PORT = 5000
app.listen(PORT, () => {
    console.log('Server is running...')
})