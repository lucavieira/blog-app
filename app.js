// Modulos utilizados
const express = require('express') // Criação do servidor
const handlebars = require('express-handlebars') // Template para o front
const body_parser = require('body-parser') // Pegar os valores do formulario
const app = express()
const admin = require('./routes/admin') // Rotas do Administrador
const path = require('path')
const mongoose = require('mongoose') // Banco de Dados para armazenar os dados do app
const session = require('express-session') // Armazena os dados da sessão no servidor, salva apenas o ID no cookie.
const flash = require('connect-flash') // Flash para criar as mensagens e mostrar na tela apenas por um breve momento 

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
            // Variaveis globais que irão armazenar mensagens de sucesso ou de error
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