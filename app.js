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
require('./models/Posts')
require('./models/Category')
const Post = mongoose.model('posts')
const Category =  mongoose.model('category')

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
        Post.find().lean().populate('category').sort({create_date: 'desc'}).then(posts => {
            res.render('index',  {posts: posts})
        }).catch(error => {
            req.flash('error_msg', 'Erro interno.')
            res.redirect('/404')
        })
    })

    app.get('/post/:slug', (req, res) => {
        Post.findOne({slug: req.params.slug}).lean().then(post => {
            if(post) {
                res.render('posts/index', {post: post})
            }else {
                req.flash('error_msg', 'Esse Post não existe')
                res.redirect('/')
            }
        }).catch(error => {
            req.flash('error_msg', 'Erro Interno')
            res.redirect('/')
        })
    })

    app.get('/404', (req, res) => {
        res.send('Error 404')
    })

    app.get('/categories', (req, res) => {
        Category.find().lean().then(categories => {
            res.render('category/index', {categories: categories})
        }).catch(error => {
            req.flash('error_msg', 'Erro ao carregar as categorias')
            res.redirect('/')
        })
    })

    app.get('/categories/:slug', (req, res) => {
        Category.findOne({slug: req.params.slug}).lean().then(category => {
            if(category) {
                Post.find({category: category._id}).lean().then(posts => {
                    res.render('category/posts', {posts: posts, category: category})
                }).catch(error => {
                    req.flash('error_msg', 'Erro ao listar posts')
                    res.redirect('/')
                })
            }else {
                req.flash('error_msg', 'Essa categoria não foi encontrada.')
                res.redirect('/')
            }
        }).catch(error => {
            req.flash('error_msg', 'Erro ao listar os posts com essa categoria')
            res.redirect('/')
        })
    })
    
    app.use('/admin', admin)
// Others
const PORT = 5000
app.listen(PORT, () => {
    console.log('Server is running...')
})