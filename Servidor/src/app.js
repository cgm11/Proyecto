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
app.use(bodyParser.urlencoded({ extended: false }));

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
        //console.log('el resultado de response es: '+response);
        if(response != null)
        {
        	let rolEncontrado = funciones.retornarRol(loginData);
        	if(rolEncontrado=="aspirante")
        		{
        			res.render('aspirante', {
       		 		correo: req.body.correo,
        			cedula: parseInt(req.body.documento)
    				})
        		}else{
        			res.render('coordinador', {
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

app.get('/coordinador', (req, res) => {
    res.render('coordinador')
});

app.get('/crearCurso', (req, res) => {
    res.render('crearCurso')
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
        //console.log('el resultado de response es: '+response);
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


app.post('/mostrarCursos', (req, res) => {
    let mensajeEditarCurso = '';
    let loginData ={
        idCurso: parseInt(req.body.idCurso),
        estado: req.body.estado
    }

    if (!isNaN(loginData.idCurso)){
        console.log("Entre a Editar curso");
        mensajeEditarCurso = funciones.editarCurso(loginData.idCurso,loginData.estado);
    }
    res.render('mostrarCursos', {
    	id: parseInt(req.body.id),
        nombre: req.body.nombre,
        modalidad: req.body.modalidad,
        valor: parseInt(req.body.valor),
        descripcion: req.body.descripcion,
        intensidad: parseInt(req.body.intensidad),
        estado: "Disponible",
        mensajeEditarCurso: mensajeEditarCurso
    })
})

app.get('/mostrarCursos', (req, res) => {
    res.render('mostrarCursos', {
    	id: parseInt(req.body.id),
        nombre: req.body.nombre,
        modalidad: req.body.modalidad,
        valor: parseInt(req.body.valor),
        descripcion: req.body.descripcion,
        intensidad: parseInt(req.body.intensidad),
        estado: "Disponible"
    })
})

app.get('/calculos',(req,res)=>{
	res.render('calculos')
})

app.get('/aspirante', (req, res) => {
    res.render('aspirante', {
    	correo: req.body.correo,
        cedula: parseInt(req.body.documento),
        nombre: req.body.nombre,
        telefono: req.body.telefono
    })
});

app.post('/editarUsuario', (req, res) => {
    let mensajeEditarUsuario='';
    let loginData ={    
        correo: req.body.correo,
        cedula: parseInt(req.body.cedula),
        nombre: req.body.nombre,
        telefono: req.body.telefono,
        rol: req.body.rol
    }
    console.log("valor de cedula: "+loginData.cedula)
    if (!isNaN(loginData.cedula)){
        console.log("Entre a Editar usuario");
        mensajeEditarUsuario = funciones.actualizarUsuario(loginData.cedula,loginData.nombre,loginData.correo,loginData.telefono,loginData.rol);
    }
    res.render('editarUsuario',{
        mensajeEditarUsuario: mensajeEditarUsuario
    })
});
app.get('/editarUsuario', (req, res) => {
    res.render('editarUsuario')
})

app.get('*', (req, res) => {
    res.render('error')
})

app.listen(3000, () => {
    console.log('Escuchando en el puerto 3000');
});