const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Category')
require('../models/Posts')
const Categoria = mongoose.model('category')
const Post = mongoose.model('posts')


router.get('/', (req, res) => {
    res.render('admin/index')
})

router.get('/category', (req, res) => {
    Categoria.find().lean().then(categorias => {
        res.render('admin/category', {categorias: categorias})
    }).catch(error => {
        req.flash('error_msg', 'Erro ao listar categorias!')
        res.redirect('/admin')
    })
})

router.get('/category/add', (req, res) => {
    res.render('admin/addcategory')
})

router.post('/category/new', (req, res) => {

    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({error: 'Nome inválido.'})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({error: 'Slug inválido.'})
    }

    if(erros.length > 0) {
        res.render('admin/addcategory', {erros: erros})
    }else {
        const newCategory = {
            nome: req.body.nome,
            slug: req.body.slug
        }
    
        new Categoria(newCategory).save().then(() => {
            req.flash('success_msg', 'Categoria criada com sucesso')
            res.redirect('/admin/category')
        }).catch(error => {
            req.flash('error_msg', 'Falha ao criar a categoria. Tente novamente!')
            res.redirect('/admin')
        })
    }
})

router.get('/category/edit/:id', (req, res) => {
    Categoria.findOne({_id:req.params.id}).lean().then(categoria => {
        res.render('admin/editcategory', {categoria: categoria})
    }).catch(error => {
        req.flash('error_msg', 'Categoria não encontrada.')
        res.redirect('/admin/category')
    })
})

router.post('/category/edit', (req, res) => {
    Categoria.findOne({_id:req.body.id}).then(categoria => {
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(() => {
            req.flash('success_msg', 'Categoria editada.')
            res.redirect('/admin/category')
        }).catch(error => {
            req.flash('error_msg', 'Error ao editar a categoria')
            res.redirect('/admin/category')
        })
    }).catch(error => {
        req.flash('error_msg', 'Erro ao editar a categoria')
        res.redirect('/admin/category')
    })
})

router.post('/category/delete', (req, res) => {
    Categoria.remove({_id: req.body.id}).then(() => {
        req.flash('success_msg', 'Deletada com sucesso')
        res.redirect('/admin/category')
    }).catch(error => {
        req.flash('error_msg', 'Erro ao deletar')
        res.redirect('/admin/category')
    })
})

router.get('/posts', (req, res) => {
    Post.find().populate('category').sort({create_date: 'desc'}).lean().then(posts => {
        res.render('admin/posts', {posts: posts})
    }).catch(error => {
        req.flash('error_msg', 'Ocorreu um erro ao listar os posts')
        res.redirect('/admin')
    })
})

router.get('/posts/add', (req, res) => {
    Categoria.find().lean().then(categorias => {
        res.render('admin/addposts', {categorias: categorias})
    }).catch(error => {
        req.flash('error_msg', 'Erro ao carregar formulario')
        res.redirect('/admin')
    })
})

router.post('/posts/new', (req, res) => {
    var erros = []

    if(req.body.category == 0) {
        erros.push({text: 'Categoria invalida, registre uma categoria.'})
    }

    if(erros.length > 0) {
        res.render('admin/posts', {erros: erros})
    }else {
        const newPost = {
            title: req.body.title,
            slug: req.body.slug,
            description: req.body.description,
            content: req.body.content,
            category: req.body.category
        }

        new Post(newPost).save().then(() => {
            req.flash('success_msg', 'Post criado com sucesso')
            res.redirect('/admin/posts')
        }).catch(error => {
            req.flash('error_msg', 'Ocorreu um erro ao criar o post')
            res.redirect('/admin/posts')
        })
    }
})

router.get('/posts/edit/:id', (req, res) => {
    Post.findOne({_id: req.params.id}).lean().then(posts => {
        Categoria.find().lean().then(categorias => {
            res.render('admin/editposts', {categorias: categorias, posts: posts})
        }).catch(error => {
            req.flash('error_msg', 'Ocorreu um erro ao listar as categorias')
            res.redirect('/admin/posts')
        })
    }).catch(error => {
        req.flash('error_msg', 'Erro ao carregar postagem')
        res.redirect('/admin/posts')
    })
})

router.post('/posts/edit', (req, res) => {
    Post.findOne({_id:req.body.id}).then(post => {
        post.title = req.body.title,
        post.slug = req.body.slug,
        post.description = req.body.description,
        post.content = req.body.content
        post.category = req.body.category

        post.save().then(() => {
            req.flash('success_msg', 'Post editada com sucesso')
            res.redirect('/admin/posts')
        }).catch(error => {
            req.flash('error_msg', 'Erro interno')
            res.redirect('/admin/posts')
        })
    }).catch(error => {
        req.flash('error_msg', 'Erro ao salvar edição')
        res.redirect('/admin/posts')
    })
})

router.get('/posts/delete/:id', (req, res) => {
    Post.remove({_id:req.params.id}).then(() => {
        req.flash('success_msg', 'Post deletado com sucesso')
        res.redirect('/admin/posts')
    }).catch(error => {
        req.flash('error_msg', 'Erro ao deletar post')
        res.redirect('/admin/posts')
    })
})

module.exports = router