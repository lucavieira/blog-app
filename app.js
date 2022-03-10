// Modulos utilizados
const express = require('express')
const handlebars = require('express-handlebars')
const body_parser = require('body-parser')
const app = express()
const admin = require('./routes/admin')
const path = require('path')
//const mongoose = require('mongoose')

// Config's
    // body-parser
        app.use(body_parser.urlencoded({extended: true}))
        app.use(body_parser.json())
    // handlebars
        app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars')
    // Mongoose
    // Public
        app.use(express.static(path.join(__dirname, 'public')))
// Routes
    app.use('/admin', admin)
// Others
const PORT = 5000
app.listen(PORT, () => {
    console.log('Server is running...')
})