const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')
require('./models/Postagem')
const Postagem = mongoose.model('postagens')

const admin = require('./routes/admin')

const app = express()

app.use(session({
    secret: "cursodenode",
    resave: true,
    saveUninitialized: true
}))
app.use(flash())

app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    next()
})

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.engine('handlebars', handlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

app.use(express.static(path.join(__dirname, 'public')))

mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost/blogApp", { useNewUrlParser: true }).then(() => {
    console.log("Conectado ao mongo")
}).catch((err) => {
    console.log("Erro ao se conectar: " + err)
})

app.get('/', (req, res) => {

    Postagem.find().populate('categoria').sort({data: 'desc'}).then((postagens) => {

        res.render('index', {postagens: postagens})

    }).catch((err) => {

        req.flash('error_msg', 'Houve um erro inesperado')
        res.redirect('/404')
    })
    
})

app.get('/postagem/:slug', (req, res) => {

    Postagem.findOne({slug: req.params.slug}).then((postagem) => {

        if(postagem){

            res.render('postagem/index', {postagem: postagem})
        }else{

            req.flash('error_msg', 'Essa postagem não existe')
            res.redirect('/')
        }
    }).catch((err) => {

        req.flash('error_msg', 'Houve um erro inesperado')
        res.redirect('/')
    })
})

app.get('/404', (req, res) => {

    res.send('Erro 404!')
})

app.get('/posts', (req, res) => {

    res.send('Lista Posts')
})

app.use('/admin', admin)

const PORT = process.env.PORT || 8081

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})