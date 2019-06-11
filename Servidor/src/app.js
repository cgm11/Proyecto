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
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.render('index')
});

app.post('/ingreso', (req, res) => {
    res.render('ingreso', {
        correo: req.body.correo,
        cedula: parseInt(req.body.documento)
    })
})

app.get('/registro', (req, res) => {
    res.render('registro')
});

app.get('/coordinador', (req, res) => {
    res.render('coordinador')
});

app.get('/crearCurso', (req, res) => {
    res.render('crearCurso')
});

app.post('/listaCursos', (req, res) => {
    res.render('listaCursos', {
    	correo: req.body.correo,
        cedula: parseInt(req.body.documento),
        nombre: req.body.nombre,
        telefono: req.body.telefono
    })
})

app.post('/mostrarCursos', (req, res) => {
    res.render('mostrarCursos', {
    	id: parseInt(req.body.id),
        nombre: req.body.nombre,
        modalidad: req.body.modalidad,
        valor: req.body.valor,
        descripcion: req.body.descripcion,
        intensidad: req.body.intensidad
    })
})

app.get('/calculos',(req,res)=>{
	res.render('calculos')
})

app.get('*', (req, res) => {
    res.render('error')
})

app.listen(3000, () => {
    console.log('Escuchando en el puerto 3000');
});