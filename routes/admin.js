const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Category')
const Categoria = mongoose.model('category')

router.get('/', (req, res) => {
    res.render('admin/index')
})

router.get('/posts', (req, res) => {
    res.send('Posts page')
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

module.exports = router