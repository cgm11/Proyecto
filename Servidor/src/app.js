//Requires
require('./config/config');
const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
require('./helper')
const funciones = require('./funciones');
const mongoose = require('mongoose');
const Usuario = require('./models/usuario');
const bcrypt = require('bcrypt');
const session = require('express-session')
var MemoryStore = require('memorystore')(session)

//Paths
const directoriopublico = path.join(__dirname, '../public');
const directoriopartials = path.join(__dirname, '../partials');

//Static
app.use(express.static(directoriopublico));

hbs.registerPartials(directoriopartials);

//### Para usar las variables de sesión
app.use(session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
        }),
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}))

//BodyParser
app.use(bodyParser.urlencoded({ extended: false }));

//hbs
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    funciones.borrarDocumentoGlobal();
    res.render('index', {
        mensajeUsuario: ""
    })

});

app.post('/ingreso', (req, res) => {
    let rolEncontrado = '';
    Usuario.findOne({nombreUser : req.body.nombreUser}, (err, resultados) => {
        if (err){
            return console.log(err)
        }
        if(!resultados){
            return res.render ('index', {
            mensajeUsuario : "Usuario y/o contraseña erronea"           
            })
        }
        if(!bcrypt.compareSync(req.body.password, resultados.password)){
            return res.render ('index', {
            mensajeUsuario : "Usuario y/o contraseña erronea"           
            })
        }
        //Para crear las variables de sesión
            req.session.usuario = resultados._id;
            req.session.nombre = resultados.nombre;
            req.session.cedula = resultados.cedula;
    rolEncontrado = resultados.rol;
    //let loginData = {
    //    correo: req.body.correo,
    //    cedula: parseInt(req.body.documento),
    //}
    //let response = funciones.buscarDuplicado(loginData);
    funciones.guardarDocumentoGlobal(resultados.cedula);
    //console.log('el resultado de response es: '+response);
    //if (response != null) {
        //let rolEncontrado = funciones.retornarRol(loginData);
        if (rolEncontrado == "aspirante") {
            res.render('aspirante', {
                correo: resultados.correo,
                cedula: resultados.documento
            })
        } else {
            res.render('coordinador', {
                correo: resultados.correo,
                cedula: resultados.documento
            })
        }
    //}
    //else {
    //    res.render('registro')
    //}
    })
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
    let mensajeUsuario = '';
    let loginData = {
        //
        correo: req.body.correo,
        cedula: parseInt(req.body.documento),
        nombre: req.body.nombre,
        telefono: req.body.telefono,
    }
    let usuario = new Usuario ({
        nombre: req.body.nombre,
        cedula: parseInt(req.body.documento),
        correo: req.body.correo,
        telefono: req.body.telefono,
        rol: "aspirante",
        nombreUser : req.body.nombreUser,
        password : bcrypt.hashSync(req.body.password, 10)
    })
    console.log('usuario: '+usuario.nombre+', cedula: '+usuario.cedula)
    console.log('correo: '+usuario.correo+', telefono: '+usuario.telefono)
    console.log('nombreUser: '+usuario.nombreUser+', password: '+usuario.password)
    Usuario.findOne({cedula : parseInt(req.body.documento)}, (err, resultados) => {
        if (err){
            return console.log(err)
        }
        if(!resultados){
            
        usuario.save((err, resultado) => {
            if(err){
            //resultado2 = "ERROR EN GUARDADO DE MONGO";
            return res.render('index', {
            nombre: loginData.nombre,
            mensajeUsuario: 'error: ' + err
            })
            }
            return res.render('listaCursos', {
            nombre: loginData.nombre,
            resultadoNuevo: 'Ingreso Exitoso'
            })
            })
        }else{
            return res.render ('index', {
            mensajeUsuario : "Usuario ya registrado"           
            })
        }
})
        //resultado2 = ("Ingreso exitoso: "+resultado);
        //console.log('el valor de resultado en mongo es: '+ resultado +', error: '+ err)
    
    //let response = funciones.buscarDuplicado(loginData);
    //console.log('el resultado de response es: '+response);
    /*if (response == null) {
        res.render('listaCursos', {
            nombre: req.body.nombre,
            correo: req.body.correo,
            cedula: parseInt(req.body.documento),
            telefono: req.body.telefono,
        });
    } else {
        res.render('index', {
            correo: req.body.correo,
            cedula: parseInt(req.body.documento),
            mensajeUsuario: "USUARIO YA REGISTRADO"
        });
    }*/
});

app.get('/verInscritos', (req, res) => {
    res.render('verInscritos')
})

app.post('/verInscritos', (req, res) => {
    let mensajeVerInscritos = '';
    let mensajeVerInscritosEliminar = '';
    let loginData = {
        idCurso: parseInt(req.body.idCurso),
        cedula: parseInt(req.body.cedulaUsuario),
        idCursoVer: parseInt(req.body.idCursoVer)
    }
    console.log('idCursoVer: '+loginData.idCursoVer+', cedula: '+loginData.cedula+' y idCurso: '+loginData.idCurso);
    if (!isNaN(loginData.cedula)&&(!isNaN(loginData.idCurso))){
        console.log("Entre a mensajeVerInscritosEliminar ");
        mensajeVerInscritosEliminar = funciones.mensajeVerInscritosEliminar(loginData.idCurso,loginData.cedula);
                console.log('valor de mensajeVerInscritosEliminar: '+mensajeVerInscritosEliminar);
                console.log("Entre a mensajeVerInscritos curso");
        mensajeVerInscritos = funciones.VerInscritos(loginData.idCurso);
    }else{
        if (!isNaN(loginData.idCurso)){
        console.log("Entre a mensajeVerInscritos curso");
        mensajeVerInscritos = funciones.VerInscritos(loginData.idCurso);
        }
    }
    res.render('verInscritos', {
        mensajeVerInscritos: mensajeVerInscritos,
        mensajeVerInscritosEliminar: mensajeVerInscritosEliminar
    })
})

app.post('/mostrarCursos', (req, res) => {
    let mensajeEditarCurso = '';
    let loginData = {
        idCurso: parseInt(req.body.idCurso),
        estado: req.body.estado
    }

    if (!isNaN(loginData.idCurso)) {
        console.log("Entre a Editar curso");
        mensajeEditarCurso = funciones.editarCurso(loginData.idCurso, loginData.estado);
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

app.get('/calculos', (req, res) => {
    res.render('calculos')
})

app.post('/aspirante', (req, res) => {
    console.log('Entro a post');
    let mensajeVerInscritos = '';
    let mensajeVerInscritosEliminar = '';
    let loginData = {
        id: parseInt(req.body.id),
        idEliminar: parseInt(req.body.idEliminar)
    }
    console.log('idCursoVer: '+loginData.idCursoVer+', cedula: '+loginData.cedula+' y idCurso: '+loginData.idCurso);
    if (!isNaN(loginData.idEliminar)){
        console.log("Entre a mensajeVerInscritosEliminar ");
        mensajeVerInscritosEliminar = funciones.EliminarInscripcionAspirante(loginData.idEliminar);
                console.log('valor de mensajeVerInscritosEliminar: '+mensajeVerInscritosEliminar);
                console.log("Entre a mensajeVerInscritos curso");
    }
    res.render('aspirante', {
        id: parseInt(req.body.id),
        idEliminar: parseInt(req.body.idEliminar),
        mensajeVerInscritosEliminar: mensajeVerInscritosEliminar
    })
});


/*app.get('/aspirante', (req, res) => {
    //console.log('Entro a get');
    res.render('aspirante', {
        correo: req.body.correo,
        cedula: parseInt(req.body.documento),
        nombre: req.body.nombre,
        telefono: req.body.telefono
    })
});*/

app.post('/editarUsuario', (req, res) => {
    let mensajeEditarUsuario = '';
    let listaUsuariosMongo = [];
    let loginData = {
        correo: req.body.correo,
        cedula: parseInt(req.body.cedula),
        nombre: req.body.nombre,
        telefono: req.body.telefono,
        rol: req.body.rol
    }
    console.log("valor de cedula: " + loginData.cedula)
    let arregloUpdate = {};
    if (!isNaN(loginData.cedula)) {
        console.log("Entre a Editar usuario Mongo");
        if (req.body.nombre != null && req.body.nombre != "") {
            let nombre = "nombre";
            //console.log('valores de existe, nombre ' + existe.nombre);
            arregloUpdate[nombre] = req.body.nombre;
        }
        if (req.body.correo != null && req.body.correo != "") {
            let correo = "correo";
            //console.log('valores de existe, correo ' + existe.correo);
            arregloUpdate[correo] = req.body.correo;
        }
        if (req.body.telefono != null && req.body.telefono != "") {
            let telefono = "telefono";
            //console.log('valores de existe, telefono ' + existe.telefono);
            arregloUpdate[telefono] = req.body.telefono;
        }
        if (req.body.rol != null && req.body.rol != "" && req.body.rol != "-") {
            let rol = "rol";
            //console.log('valores de existe, rol ' + existe.rol);
            arregloUpdate[rol] = req.body.rol;
        }
        //let arregloUpdate = {};
        let update = 'Update6';
        let nombreU = 'nombre';
        //arregloUpdate[nombreU] = update;
        //let estudianteNota = arregloUpdate.find(function(notaEst ) {
        //return notaEst.id == 12345});
        Usuario.findOneAndUpdate({cedula : parseInt(req.body.cedula)}, {$set:arregloUpdate}, {new : true, runValidators: true, context: 'query'}, (err, resultados) => {
            //  findOneAndUpdate({nombre :           req.body.nombre}, req.body,             {new : true, runValidators: true, context: 'query' }, (err, resultados) => {
        if (err){
            return console.log(err)
        }
        
    })  

        //mensajeEditarUsuario = funciones.actualizarUsuario(loginData.cedula, loginData.nombre, loginData.correo, loginData.telefono, loginData.rol);
    }
    ///
    Usuario.find({},(err,respuesta)=>{
        if (err){
            //res.render('editarUsuario', {
        //mensajeEditarUsuario: mensajeEditarUsuario,
        listado : ""
    //})
            return console.log(err)
        }
        res.render ('editarUsuario',{
            listado : respuesta,
            mensajeEditarUsuario: mensajeEditarUsuario
        })
    })
    ///
    
});
app.get('/editarUsuario', (req, res) => {
    Usuario.find({},(err,respuesta)=>{
        if (err){
            return console.log(err)
        }

        res.render ('editarUsuario',{
            listado : respuesta
        })
    })
    
})


app.get('*', (req, res) => {
    res.render('error')
})

//app.listen(3000, () => {
//  console.log ('servidor en el puerto 3000')
//});

//Routers
//app.use(require('./routers/index'));

mongoose.connect('mongodb://localhost:27017/asignaturas', {useNewUrlParser: true}, (err, resultados)=>{
    if(err){
    return console.log('error conectando usuarios');
    }
    return console.log('conectado de mongodb');
  });

app.listen(process.env.PORT, () => {
    console.log ('servidor en el puerto: '+ process.env.PORT)
});