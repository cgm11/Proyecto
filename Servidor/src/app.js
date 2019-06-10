const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
require('./helper')

const directoriopublico = path.join(__dirname, '../public');
const directoriopartials = path.join(__dirname, '../partials');
app.use(express.static(directoriopublico));
hbs.registerPartials(directoriopartials);
app.use(bodyParser.urlencoded({extended: false}));

app.set('view engine', 'hbs');

app.get('/',(req, res) => {
    res.render('index')
});

app.post('/ingreso', (req, res) => {
    res.render('ingreso', {
        correo: req.body.correo,
        cedula: parseInt(req.body.documento)
    })
})

app.get('/registro',(req, res) => {
    res.render('registro')
});

app.get('*', (req, res) => {
    res.render('error')
})

app.listen(3000, () => {
    console.log('Escuchando en el puerto 3000');
});