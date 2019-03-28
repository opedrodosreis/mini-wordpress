const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
//const mongoose = require('mongoose')
const path = require('path')

const admin = require('./routes/admin')

const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.engine('handlebars', handlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {

    res.send('Rota principal')
})

app.get('/posts', (req, res) => {

    res.send('Lista Posts')
})

app.use('/admin', admin)

const PORT = process.env.PORT || 8081

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})