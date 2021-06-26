/*jshint esversion: 6 */

//Importar Modules
const express = require('express');
const Product = require('../models/product');
const path = require('path'); //nos ayuda a que acomplete las rutas de las carpetas

const expressSession = require('express-session');
//Cargar Middleware
const autMid = require('../middleware/authMiddleware');

const redirectIfAuth = require('../middleware/redirectIfAuth');


//Crear un objeto router
const router = express.Router();

//exportar nuestro router
module.exports = router;

//Activacion de las sesiones (cookie)
router.use(expressSession({
    secret: 'ittgogalgos',
    resave: true,
    saveUninitialized: true
}));

//Variables Globales
router.use((req, res, next) => {
    res.locals.loggedIn = req.session.userId || null;
    next();
});

//Pagina home
router.get('/',(req,res) => {
    res.render('home');
});

//Consulta de todos los datos
router.get('/api/product',autMid, (req, res) => {
    //Select * from
    Product.find({}, (err, products) =>{
        //Error del servidor
        if(err) return res.status(500).send({
            message: `Error al realizar la petición ${err}`
        });

        //Si no encuentra producto
        if(!products) return res.status(404).send({
            message: 'No existen productos'
        });

        //Todo funciono
        //res.status(200).send({ products: [products] });

        res.render('showproducts', { products});
    }).lean();

});

//Consulta por filtro --para 1 solo dato --OLIVAS CALDERON CINTHIA GPE.
router.get('/api/product/:datoBusqueda', autMid, (req,res) => {
    let datoBusqueda = req.params.datoBusqueda;
    Product.findById(datoBusqueda, (err, todoOK) => {
    //Product.find({price:datoBusqueda}, (err,todoOK) =>{
        if(err) return res.status(500).send({
            message: `Error al realizar la petición ${err}`
        });

        //Si no encuentra producto
        if(!todoOK) return res.status(404).send({
            message: 'El producto no existe'
        });

        //res.status(200).send({product:todoOK});
        res.render('editar', {products:todoOK});
    }).lean();
});

// Insertar datos
router.get('/insertProduct',autMid, (req,res) => {
    res.render('product');
});

//Modificar producto PUT
const putProduct = require('../controllers/putProduct');
router.put('/api/product/:productId',autMid,putProduct);

//Borrar un registro DELETE
const delProduct = require('../controllers/delProduct');
router.delete('/api/product/:productId', autMid,delProduct);

// Insertar valores en BD
router.post('/api/product', autMid,(req, res) => {
    let product = new Product();
    product.name = req.body.name;
    product.picture = req.body.avatar;
    product.price = req.body.price;
    product.category = (req.body.category).toLowerCase();
    product.description = req.body.description;

    console.log(req.body);

    product.save((err, productStored) => {
        if(err) return res.status(500).send ({
            message: `Error al realizar la petición ${err}`
        });

        //res.status(200).send({product: productStored});
        res.redirect('/api/product');
        
    });


});

//Pagina login
const logincontroller = require('../controllers/login');
router.get('/auth/login',redirectIfAuth,logincontroller);

const loginUsercontroller = require('../controllers/loginuser');
router.post('/users/login',redirectIfAuth,loginUsercontroller);


//Pagina para registro de nuevos usuarios
const newUser = require('../controllers/newuser');
router.get('/users/register',redirectIfAuth, newUser);


//metodo POST para registro
const newusercontroller = require('../controllers/storeuser');
router.post('/auth/register',redirectIfAuth, newusercontroller);

// Metodo GET para logout
const logoutcontroller = require('../controllers/logout');
router.get('/auth/logout', logoutcontroller);

//Se activa cuando ninguno de los metodos tenga la direccion, es importante donde se coloca en el código
router.use((req,res) => {
    res.render('notfound');
});

