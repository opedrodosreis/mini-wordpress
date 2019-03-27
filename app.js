const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
//const mongoose = require('mongoose')

const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.engine('handlebars', handlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

const PORT = process.env.PORT || 8081

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})