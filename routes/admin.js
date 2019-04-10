const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model("categorias")
require('../models/Postagem')
const Postagem = mongoose.model("postagens")
const {permissao} = require('../helpers/permissao')

router.get('/', permissao, (req, res) => {

    res.render('admin/index')
})

router.get('/categorias', permissao, (req, res) => {

    Categoria.find().sort({data: 'desc'}).then((categorias) => {

        res.render('admin/categorias', {categorias: categorias})

    }).catch((err) => {

        req.flash('error_msg', 'Houve um erro ao listar as categorias')
        res.redirect('/admin')
    })
})

router.get('/categorias/add', permissao, (req, res) => {

    res.render('admin/addcategoria')
})

router.post('/categorias/nova', permissao, (req, res) => {

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

router.get('/categorias/edit/:id', permissao, (req, res) => {

    Categoria.findOne({_id: req.params.id}).then((categoria) => {

        res.render('admin/editcategoria', {categoria: categoria})

    }).catch((err) => {

        req.flash('error_msg', 'Essa categoria não existe')
        res.redirect('/admin/categorias')
    })
})

router.post('/categorias/edit', permissao, (req, res) => {

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

router.post('/categorias/delete', permissao, (req, res) => {

    Categoria.remove({_id: req.body.id}).then(() => {

        req.flash('success_msg', 'Categoria deletada com sucesso!')
        res.redirect('/admin/categorias')

    }).catch((err) => {

        req.flash('error_msg', 'Houve um erro ao deletar a categoria')
        res.redirect('/admin/categorias')
    })
})

router.get('/postagens', permissao, (req, res) => {

    Postagem.find().populate('categoria').sort({data: 'desc'}).then((postagens) => {

        res.render('admin/postagens', {postagens: postagens})

    }).catch((err) => {

        req.flash('error_msg', 'Houve um erro ao listar as postagens')
        res.redirect('/admin')
    })
})

router.get('/postagens/add', permissao, (req, res) => {

    Categoria.find().then((categorias) => {

        res.render('admin/addpostagem', {categorias: categorias})

    }).catch((err) => {

        req.flash('error_msg', 'Houve um erro inesperado')
        res.redirect('/admin')
    })
})

router.post('/postagens/nova', permissao, (req, res) => {

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

        res.render('admin/addpostagem', {erros: erros})

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

router.get('/postagens/edit/:id', permissao, (req, res) => {

    Postagem.findOne({_id: req.params.id}).then((postagem) => {

        Categoria.find().then((categorias) => {

            res.render('admin/editpostagem', {postagem: postagem, categorias: categorias})

        }).catch((err) => {

            req.flash('error_msg', 'Houve um erro ao carregar o formulário de edição')
            res.redirect('/admin/postagens')
        })
    }).catch((err) => {

        req.flash('error_msg', 'Houve um erro ao carregar o formulário de edição')
        res.redirect('/admin/postagens')
    })
})

router.post('/postagens/edit', permissao, (req, res) => {

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

        res.render('admin/editpostagem', {erros: erros})

    }else{

        Postagem.findOne({_id: req.body.id}).then((postagem) => {

            postagem.titulo = req.body.titulo
            postagem.slug = req.body.slug
            postagem.descricao = req.body.descricao
            postagem.conteudo = req.body.conteudo
            postagem.categoria = req.body.categoria

            postagem.save().then(() => {

                req.flash('success_msg', 'Postagem editada com sucesso!')
                res.redirect('/admin/postagens')

            }).catch((err) => {

                req.flash('error_msg', 'Houve um erro ao salvar a edição')
                res.redirect('/admin/postagens')
            })

        }).catch((err) => {

            req.flash('error_msg', 'Houve um erro ao salvar a edição')
            res.redirect('/admin/postagens')
        })
    }
})

router.post('/postagens/delete', permissao, (req, res) => {

    Postagem.remove({_id: req.body.id}).then(() => {

        req.flash('success_msg', 'Postagem deletada com sucesso!')
        res.redirect('/admin/postagens')

    }).catch((err) => {

        req.flash('error_msg', 'Houve um erro ao deletar a postagem')
        res.redirect('/admin/postagens')
    })
})

module.exports = router