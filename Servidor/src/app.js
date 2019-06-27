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
const Curso = require('./models/cursos');

//Paths
const directoriopublico = path.join(__dirname, '../public');
const directoriopartials = path.join(__dirname, '../partials');

//Static
app.use(express.static(directoriopublico));

hbs.registerPartials(directoriopartials);

//BodyParser
app.use(bodyParser.urlencoded({
    extended: false
}));

//hbs
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    funciones.borrarDocumentoGlobal();
    res.render('index', {
        mensajeUsuario: ""
    })

});

app.post('/ingreso', (req, res) => {
    let loginData = {
        correo: req.body.correo,
        cedula: parseInt(req.body.documento),
    }
    let response = funciones.buscarDuplicado(loginData);
    funciones.guardarDocumentoGlobal(loginData.cedula);
    //console.log('el resultado de response es: '+response);
    if (response != null) {
        let rolEncontrado = funciones.retornarRol(loginData);
        if (rolEncontrado == "aspirante") {
            res.render('aspirante', {
                correo: req.body.correo,
                cedula: parseInt(req.body.documento)
            })
        } else {
            res.render('coordinador', {
                correo: req.body.correo,
                cedula: parseInt(req.body.documento)
            })
        }
    } else {
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
    let mensajeUsuario = '';
    let loginData = {
        //
        correo: req.body.correo,
        cedula: parseInt(req.body.documento),
        nombre: req.body.nombre,
        telefono: req.body.telefono,
    }
    let usuario = new Usuario({
        nombre: req.body.nombre,
        cedula: parseInt(req.body.documento),
        correo: req.body.correo,
        telefono: req.body.telefono,
        rol: "aspirante"
    })
    console.log('usuario: ' + usuario.nombre + ', cedula: ' + usuario.cedula)
    console.log('correo: ' + usuario.correo + ', telefono: ' + usuario.telefono)
    usuario.save((err, resultado) => {
        if (err) {
            //resultado2 = "ERROR EN GUARDADO DE MONGO";
            res.render('index', {
                nombre: loginData.nombre,
                mensajeUsuario: 'error: ' + err
            });
        }
        res.render('listaCursos', {
            nombre: loginData.nombre,
            resultadoNuevo: 'Ingreso Exitoso'
        });
        //resultado2 = ("Ingreso exitoso: "+resultado);
        //console.log('el valor de resultado en mongo es: '+ resultado +', error: '+ err)
    });
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
    console.log('idCursoVer: ' + loginData.idCursoVer + ', cedula: ' + loginData.cedula + ' y idCurso: ' + loginData.idCurso);
    if (!isNaN(loginData.cedula) && (!isNaN(loginData.idCurso))) {
        console.log("Entre a mensajeVerInscritosEliminar ");
        mensajeVerInscritosEliminar = funciones.mensajeVerInscritosEliminar(loginData.idCurso, loginData.cedula);
        console.log('valor de mensajeVerInscritosEliminar: ' + mensajeVerInscritosEliminar);
        console.log("Entre a mensajeVerInscritos curso");
        mensajeVerInscritos = funciones.VerInscritos(loginData.idCurso);
    } else {
        if (!isNaN(loginData.idCurso)) {
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
    let loginData = {
        idCurso: parseInt(req.body.idCurso),
        estado: req.body.estado
    }

    if (!isNaN(loginData.idCurso)) {
        console.log("Entre a Editar curso");
        Curso.findOneAndUpdate({idcurso: loginData.idCurso},{estado : req.body.estado}, {new: true}, (err, resultado) => {
            if (err) {
                return console.log(err)
            }
            Curso.find({}).exec((err, resultado) => {
                if (err) {
                    return console.log(err)
                }
                res.render('mostrarCursos', {
                    mostrar: "Curso actualizado con exito",
                    listado: resultado
                })
            })
        })
        //mensajeEditarCurso = funciones.editarCurso(loginData.idCurso, loginData.estado);
    } else {
        let curso = new Curso({
            idcurso: parseInt(req.body.idcurso),
            nombre: req.body.nombre,
            modalidad: req.body.modalidad,
            valor: parseInt(req.body.valor),
            descripcion: req.body.descripcion,
            intensidad: req.body.intensidad,
            estado: "Disponible"

        })

        curso.save((err, resultado) => {
            if (err) {
                res.render('mostrarCursos', {                    
                    mostrar: "Se presentaron problemas creando el curso, \
                 por favor vuelva a intentarlo: " + err
                })
            }
            Curso.find({}).exec((err, resultado) => {
                if (err) {
                    return console.log(err)
                }
                res.render('mostrarCursos', {
                    mostrar: "Curso creado con exito",
                    listado: resultado
                })
            })

        })
    }
})

app.get('/mostrarCursos', (req, res) => {
    Curso.find({}).exec((err, resultado) => {
        if (err) {
            return console.log(err)
        }
        res.render('mostrarCursos', {
            listado: resultado
        })
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
    console.log('idCursoVer: ' + loginData.idCursoVer + ', cedula: ' + loginData.cedula + ' y idCurso: ' + loginData.idCurso);
    if (!isNaN(loginData.idEliminar)) {
        console.log("Entre a mensajeVerInscritosEliminar ");
        mensajeVerInscritosEliminar = funciones.EliminarInscripcionAspirante(loginData.idEliminar);
        console.log('valor de mensajeVerInscritosEliminar: ' + mensajeVerInscritosEliminar);
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
        Usuario.findOneAndUpdate({
            cedula: parseInt(req.body.cedula)
        }, {
            $set: arregloUpdate
        }, {
            new: true,
            runValidators: true
        }, (err, resultados) => {
            if (err) {
                return console.log(err)
            }
            //console.log('si actualice! usuarios nuevos: '+resultados)
            //res.render ('actualizar', {
            //  nombre : resultados.nombre,
            //matematicas : resultados.matematicas,
            //ingles : resultados.ingles,
            //programacion : resultados.programacion
            //})
        })

        //mensajeEditarUsuario = funciones.actualizarUsuario(loginData.cedula, loginData.nombre, loginData.correo, loginData.telefono, loginData.rol);
    }
    ///
    Usuario.find({}, (err, respuesta) => {
        if (err) {
            //res.render('editarUsuario', {
            //mensajeEditarUsuario: mensajeEditarUsuario,
            listado: ""
            //})
            return console.log(err)
        }
        res.render('editarUsuario', {
            listado: respuesta,
            mensajeEditarUsuario: mensajeEditarUsuario
        })
    })
    ///

});
app.get('/editarUsuario', (req, res) => {
    Usuario.find({}, (err, respuesta) => {
        if (err) {
            return console.log(err)
        }

        res.render('editarUsuario', {
            listado: respuesta
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

mongoose.connect('mongodb://localhost:27017/asignaturas', {
    useNewUrlParser: true
}, (err, resultados) => {
    if (err) {
        return console.log('error conectando usuarios');
    }
    return console.log('conectado de mongodb');
});

app.listen(process.env.PORT, () => {
    console.log('servidor en el puerto: ' + process.env.PORT)
});