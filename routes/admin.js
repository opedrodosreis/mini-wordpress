const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model("categorias")
require('../models/Postagem')
const Postagem = mongoose.model("postagens")

router.get('/', (req, res) => {

    res.render('admin/index')
})

router.get('/categorias', (req, res) => {

    Categoria.find().sort({data: 'desc'}).then((categorias) => {

        res.render('admin/categorias', {categorias: categorias})

    }).catch((err) => {

        req.flash('error_msg', 'Houve um erro ao listar as categorias')
        res.redirect('/admin')
    })
})

router.get('/categorias/add', (req, res) => {

    res.render('admin/addcategoria')
})

router.post('/categorias/nova', (req, res) => {

    let erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){

        erros.push({texto: 'Nome inválido'})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){

        erros.push({texto: 'Slug inválido'})
    }

    if(req.body.nome.length < 2){

        erros.push({texto: 'Nome da categoria é muito pequeno'})
    }

    if(erros.length > 0){

        res.render('admin/addcategoria', {erros: erros})

    }else{

        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
    
        new Categoria(novaCategoria).save().then(() => {

            req.flash('success_msg', 'Categoria criada com sucesso!')
            res.redirect('/admin/categorias')

        }).catch((err) => {

            req.flash('error_msg', 'Houve um erro ao criar a categoria, tente novamente!')
            res.redirect('/admin')
        })
    }
})

router.get('/categorias/edit/:id', (req, res) => {

    Categoria.findOne({_id: req.params.id}).then((categoria) => {

        res.render('admin/editcategoria', {categoria: categoria})

    }).catch((err) => {

        req.flash('error_msg', 'Essa categoria não existe')
        res.redirect('/admin/categorias')
    })
})

router.post('/categorias/edit', (req, res) => {

    let erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){

        erros.push({texto: 'Nome inválido'})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){

        erros.push({texto: 'Slug inválido'})
    }

    if(req.body.nome.length < 2){

        erros.push({texto: 'Nome da categoria é muito pequeno'})
    }

    if(erros.length > 0){

        res.render('admin/editcategoria', {erros: erros})

    }else{

        Categoria.findOne({_id: req.body.id}).then((categoria) => {

            categoria.nome = req.body.nome
            categoria.slug = req.body.slug

            categoria.save().then(() => {

                req.flash('success_msg', 'Categoria editada com sucesso!')
                res.redirect('/admin/categorias')

            }).catch((err) => {

                req.flash('error_msg', 'Houve um erro ao editar a categoria')
                res.redirect('/admin/categorias')
            })
        }).catch((err) => {

            req.flash('error_msg', 'Houve um erro ao editar a categoria')
            res.redirect('/admin/categorias')
        })
    } 
})

router.post('/categorias/delete', (req, res) => {

    Categoria.remove({_id: req.body.id}).then(() => {

        req.flash('success_msg', 'Categoria deletada com sucesso!')
        res.redirect('/admin/categorias')

    }).catch((err) => {

        req.flash('error_msg', 'Houve um erro ao deletar a categoria')
        res.redirect('/admin/categorias')
    })
})

router.get('/postagens', (req, res) => {

    res.render('admin/postagens')
})

router.get('/postagens/add', (req, res) => {

    Categoria.find().then((categorias) => {

        res.render('admin/addpostagens', {categorias: categorias})

    }).catch((err) => {

        req.flash('error_msg', 'Houve um erro inesperado')
        res.redirect('/admin')
    })
})

router.post('/postagens/nova', (req, res) => {

    let erros = []

    if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null){

        erros.push({texto: 'Título inválido'})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){

        erros.push({texto: 'Slug inválido'})
    }

    if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null){

        erros.push({texto: 'Descrição inválida'})
    }

    if(!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null){

        erros.push({texto: 'Conteúdo inválido'})
    }

    Categoria.findOne({_id: req.body.categoria}).then((categoria) => {

        if(categoria == null){
            erros.push({texto: 'Categoria inválida'})
        }
    })

    if(erros.length > 0){

        res.render('admin/addpostagens', {erros: erros})

    }else{

        const novaPostagem = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria
        }

        new Postagem(novaPostagem).save().then(() => {

            req.flash('success_msg', 'Postagem criada com sucesso!')
            res.redirect('/admin/postagens')

        }).catch((err) => {

            req.flash('error_msg', 'Houve um erro ao criar a postagem, tente novamente!')
            res.redirect('/admin')
        })
    }
})

module.exports = router