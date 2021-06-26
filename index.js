'use strict'

//Levantar configuracion
const express = require('express')
const mongoose = require('mongoose')
const config = require('./config')
const hbs = require('express-handlebars')
//Router out app
const router = require('./routers/routes')

const app = express()

//npm install -S method-override --> Para PUT Y DELETE

const methodOverride = require('method-override')
app.use(methodOverride('_method'))

//Body parser
app.use(express.urlencoded({extended:true}))
app.use(express.json())


//Motor de vistas
app.engine('.hbs', hbs({
    defaultLayout : 'index',
    extname : '.hbs'
}))

app.set('view engine', '.hbs')

//Recursos staticos/publicos
app.use('/static',express.static('public'))


app.use('/', router)

//Conexion a base de datos
mongoose.connect(config.db, config.urlParser, (err,res) => {

    if(err) {
        return console.log(`Error al conectar en la BD ${err}`)
    }

    console.log('Conexion a la BD exitosa')

    app.listen(config.port, () => {
        console.log(`Ejecutando en http://localhost:${config.port}`)
    })
})
