const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
require('./helper')
const funciones = require('./funciones');

const directoriopublico = path.join(__dirname, '../public');
const directoriopartials = path.join(__dirname, '../partials');
app.use(express.static(directoriopublico));
hbs.registerPartials(directoriopartials);
app.use(bodyParser.urlencoded({extended: false}));

app.set('view engine', 'hbs');

app.get('/',(req, res) => {
    res.render('index',{
    	mensajeUsuario:""
    })

});

app.post('/ingreso', (req, res) => {
    	let loginData ={
    	correo: req.body.correo,
        cedula: parseInt(req.body.documento),
        }
        let response = funciones.buscarDuplicado( loginData );
        console.log('el resultado de response es: '+response);
        if(response != null)
        {
        	let rolEncontrado = funciones.retornarRol(loginData);
        	if(rolEncontrado=="aspirante")
        		{
        			res.render('ingreso', {
       		 		correo: req.body.correo,
        			cedula: parseInt(req.body.documento)
    				})
        		}else{
        			res.render('ingreso', {
       		 		correo: req.body.correo,
        			cedula: parseInt(req.body.documento)
    				})
        		}
        }
        else{
        	res.render('registro')
        }
    
})

app.post('/registro', (req, res) => {
    res.render('registro')
});

app.post('/listaCursos', (req, res) => {
	let mensajeUsuario='';
	let loginData ={
    //
    	correo: req.body.correo,
        cedula: parseInt(req.body.documento),
        nombre: req.body.nombre,
        telefono: req.body.telefono,}
        let response = funciones.buscarDuplicado( loginData );
        console.log('el resultado de response es: '+response);
        if(response == null){
        	res.render('listaCursos', {
        			nombre: req.body.nombre,
        			correo: req.body.correo,
        			cedula: parseInt(req.body.documento),
        			telefono: req.body.telefono,
        	});
    	}else{
    	res.render('index', {
        correo: req.body.correo,
        cedula: parseInt(req.body.documento),
        mensajeUsuario: "USUARIO YA REGISTRADO"
    	});
	  }
	});

app.get('/calculos',(req,res)=>{
	res.render('calculos')
})

app.get('*', (req, res) => {
    res.render('error')
})

app.listen(3000, () => {
    console.log('Escuchando en el puerto 3000');
});