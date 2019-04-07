const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Usuario')
const Usuario = mongoose.model('usuarios')
const bcrypt = require('bcryptjs')

router.get('/registro', (req, res) => {

    res.render('usuarios/registro')
})

router.post('/registro', (req, res) => {

    let erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){

        erros.push({texto: 'Nome inválido'})
    }

    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){

        erros.push({texto: 'Email inválido'})
    }

    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){

        erros.push({texto: 'Senha inválida'})
    }

    if(!req.body.confirmarsenha || typeof req.body.confirmarsenha == undefined || req.body.confirmarsenha == null){

        erros.push({texto: 'Confirme sua senha'})
    }

    if(req.body.senha != req.body.confirmarsenha){

        erros.push({texto: 'As senhas não conferem'})
    }

    if(req.body.senha.length < 4){

        erros.push({texto: 'A senha deve possuir no mínimo 4 caracteres'})
    }

    if(erros.length > 0){

        res.render('usuarios/registro', {erros: erros})

    }else{

        Usuario.findOne({email: req.body.email}).then((usuario) => {

            if(usuario){

                req.flash('error_msg', 'Já existe um usuário com esse email')
                res.redirect('/usuario/registro')

            }else{

                const novoUsuario = {
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                }

                bcrypt.genSalt(10, (err, salt) => {

                    if(err){
                        req.flash('error_msg', 'Houve um erro inesperado')
                        res.redirect('/')
                    }else{
                        bcrypt.hash(novoUsuario.senha, salt, (err, hash) => {

                            if(err){

                                req.flash('error_msg', 'Houve um erro inesperado')
                                res.redirect('/')
                            }else{

                                novoUsuario.senha = hash
                                new Usuario(novoUsuario).save().then(() => {
        
                                    req.flash('success_msg', 'Usuário criado com sucesso!')
                                    res.redirect('/')
                        
                                }).catch((err) => {
                        
                                    req.flash('error_msg', 'Houve um erro ao cadastrar o usuário, tente novamente!')
                                    res.redirect('/usuario/registro')
                                })
                            }   
                        })
                    }
                })
            }
        }).catch((err) => {

            req.flash('error_msg', 'Houve um erro inesperado')
            res.redirect('/')
        })
    }
})

module.exports = router