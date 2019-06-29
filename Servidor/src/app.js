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
const Inscrito = require('./models/inscritos');
const bcrypt = require('bcrypt');
const session = require('express-session')
var MemoryStore = require('memorystore')(session)

//Paths
const directoriopublico = path.join(__dirname, '../public');
const directoriopartials = path.join(__dirname, '../partials');

//Static
app.use(express.static(directoriopublico));

hbs.registerPartials(directoriopartials);
// ### Para usar las variables de sesión
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
            req.session.correo = resultados.correo;
            req.session.telefono = resultados.telefono;
            req.session.rol = resultados.rol;
            req.session.nombreUser = resultados.nombreUser;
    rolEncontrado = resultados.rol;
    //let loginData = {
    //    correo: req.body.correo,
    //    cedula: parseInt(req.body.documento),
    //}
    //let response = funciones.buscarDuplicado(loginData);
    //funciones.guardarDocumentoGlobal(resultados.cedula);
    //console.log('el resultado de response es: '+response);
    //if (response != null) {
        //let rolEncontrado = funciones.retornarRol(loginData);
        if (rolEncontrado == "aspirante") {
            Curso.find({}).exec((err, resultado) => {
                if (err) {
                    return console.log(err)
                }
                Inscrito.find({cedula: req.session.cedula}).exec((err, aux) => {
                    if (err) {
                        return console.log(err)
                    }
                    res.render('aspirante', {
                        listado: resultado,
                        documento: req.session.cedula,
                        listadoMisCursos: aux
                    })
                })
                
            })
        } else if(rolEncontrado == "coordinador")  {
            res.render('coordinador', {
                correo: resultados.correo,
                cedula: resultados.documento
            })
        } else {
            Curso.find({docente: parseInt(req.session.cedula)}).exec((err, resultado) => {
                if (err) {
                    return console.log(err)
                }
                res.render('docente', {
                    listado: resultado,
                    correo: resultados.correo,
                    cedula: resultados.documento,                          
                })
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
    let usuario = new Usuario({
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
                mensajeVerInscritos = Inscrito.find({idcurso : parseInt(req.body.idCurso)}).exec((err, resultado) => {
                if (err) {
                    return console.log(err)
                }
                res.render('verInscritos', {
                    mensajeVerInscritos: mensajeVerInscritos,
                    mensajeVerInscritosEliminar: mensajeVerInscritosEliminar
                })
            })
        }
    }
})

app.post('/mostrarCursos', (req, res) => {
    let loginData = {
        idCurso: parseInt(req.body.idCurso),
        estado: req.body.estado
    }

    if (!isNaN(loginData.idCurso)) {
        console.log("Entre a Editar curso");  
        Curso.findOne({idcurso : parseInt(req.body.idCurso)}, (err, resultados) => {
            if(err){
                 res.render('mostrarCursos', {                    
                     mostrar: "Se presentaron incovenientes en el proceso de actualizar por favor vuelva a intentar"
                 })
             }
             if(!resultados){
                Curso.find({}).exec((err, resultado) => {
                    if (err) {
                        return console.log(err)
                    }
                    res.render('mostrarCursos', {
                        mostrar: "El id del curso no existe",
                        listado: resultado
                    })
                })           
             }else{  
                 if(req.body.estado == "Disponible"){
                    Curso.findOneAndUpdate({idcurso: loginData.idCurso},{estado : req.body.estado, docente: ""}, {new: true}, (err, resultado) => {
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
                 }else{
                    Usuario.find({rol: "docente"}).exec((err, resultado) => {
                        if (err) {
                            return console.log(err)
                        }
                        res.render('asignarDocente', {
                            mostrar: "Por favor asigne un docente para cerrar el curso con id: ",
                            listado: resultado,
                            id: req.body.idCurso,
                            estado: req.body.estado                            
                        })
                    })
                 }                
             }
            })  
        
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
        Curso.findOne({idcurso : parseInt(req.body.idcurso)}, (err, resultados) => {
           if(err){
                res.render('crearCurso', {                    
                    mostrar: "Se presentaron incovenientes en el proceso por favor vuelva a intentar"
                })
            }
            if(resultados){
            return res.render('crearCurso', {                    
                mostrar: "El id del curso ya existe, por favor validar"
            })
            }else{
                curso.save((err1, resultado) => {
                    if (err1) {
                        res.render('crearCurso', {                    
                            mostrar: "Se presentaron problemas creando el curso, \
                         por favor vuelva a intentarlo" + err1
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
    let mensajeVerInscritos = '';
    let mensajeVerInscritosEliminar = '';
    let mensajeMatricular='Hola';
    let loginData = {
        id: parseInt(req.body.id),
        idEliminar: parseInt(req.body.idEliminar)
    }
    if (!isNaN(loginData.id)) {
        let nombreCurso='';
        console.log('si entre al if para matricular');
        Curso.findOne({idcurso : parseInt(req.body.id)}, (err, resultados) => {
            console.log('el valor de resultados para findOne de busqueda curso es: '+ resultados)
           if(err){
            console.log('error al consultar curso');
            Curso.find({}).exec((err, resultado) => {
                if (err) {
                    return console.log(err)
                }
                Inscrito.find({cedula: req.session.cedula}).exec((err, aux) => {
                    if (err) {
                        return console.log(err)
                    }
                    res.render('aspirante', {
                        listado: resultado,
                        documento: req.session.cedula,
                        listadoMisCursos: aux,
                        mensajeMatricular: "Se presentaron incovenientes en el proceso por favor vuelva a intentar"
                    })
                })
            })
            }
            if(!resultados){
                Curso.find({}).exec((err, resultado) => {
                    if (err) {
                        return console.log(err)
                    }
                    Inscrito.find({cedula: req.session.cedula}).exec((err, aux) => {
                        if (err) {
                            return console.log(err)
                        }
                        res.render('aspirante', {
                            listado: resultado,
                            documento: req.session.cedula,
                            listadoMisCursos: aux,
                            mensajeMatricular: "El id del curso no existe, por favor validar"
                        })
                    })
                }) 
            }else{
                let tamanoProblema = 0;
                nombreCurso = resultados.nombre;
                let cedulaBuscada = req.session.cedula;
                let idCursoBuscado = parseInt(req.body.id);
                console.log('VOY A HACER LA CONSULTA CON idCurso: '+parseInt(req.body.id)+' y cedula: '+req.session.cedula);
                Inscrito.find({cedula : cedulaBuscada, idCurso :idCursoBuscado}, (erro, result) => {
                        console.log('valor de resultadosInscrito: '+result)
                        tamanoProblema = result.length;
                        if(erro){
                            Curso.find({}).exec((err, resultado) => {
                                if (err) {
                                    return console.log(err)
                                }
                                Inscrito.find({cedula: req.session.cedula}).exec((err, aux) => {
                                    if (err) {
                                        return console.log(err)
                                    }
                                    res.render('aspirante', {
                                        listado: resultado,
                                        documento: req.session.cedula,
                                        listadoMisCursos: aux,
                                        mensajeMatricular: "Se presentaron incovenientes en el proceso por favor vuelva a intentar"
                                    })
                                })
                            })
                        }else if(!result){console.log('Vamos bien por aca se puede matricular nueva opcion')
                    }else if(result && (tamanoProblema > 0)){
                        Curso.find({}).exec((err, resultado) => {
                            if (err) {
                                return console.log(err)
                            }
                            Inscrito.find({cedula: req.session.cedula}).exec((err, aux) => {
                                if (err) {
                                    return console.log(err)
                                }
                                res.render('aspirante', {
                                    listado: resultado,
                                    documento: req.session.cedula,
                                    listadoMisCursos: aux,
                                    mensajeMatricular: "El aspirante ya esta inscrito en este curso, por favor validar"
                                })
                            })
                        })
            }else{
                console.log('Vamos bien por aca se puede matricular')
                let inscrito = new Inscrito({
                idCurso: loginData.id,
                nombreCurso: nombreCurso,
                nombre: req.session.nombre,
                cedula: req.session.cedula,
                correo: req.session.correo,
                telefono: req.session.telefono
                })
                inscrito.save((err, resultadoinsripcion) => {
            if(err){
                Curso.find({}).exec((err, resultado) => {
                    if (err) {
                        return console.log(err)
                    }
                    Inscrito.find({cedula: req.session.cedula}).exec((err, aux) => {
                        if (err) {
                            return console.log(err)
                        }
                        res.render('aspirante', {
                            listado: resultado,
                            documento: req.session.cedula,
                            listadoMisCursos: aux,
                            mensajeMatricular: "Se presentaron incovenientes en el proceso por favor vuelva a intentar"
                        })
                    })
                })
            }
            Curso.find({}).exec((err, resultado) => {
                if (err) {
                    return console.log(err)
                }
                Inscrito.find({cedula: req.session.cedula}).exec((err, aux) => {
                    if (err) {
                        return console.log(err)
                    }
                    res.render('aspirante', {
                        listado: resultado,
                        documento: req.session.cedula,
                        listadoMisCursos: aux,
                        mensajeMatricular: "Matricula Exitosa"
                    })
                })
            })
            })
                
                }
            })
    }})
    }
    else if (!isNaN(loginData.idEliminar)) {
        console.log("Entre a mensajeVerInscritosEliminar ");
        //mensajeVerInscritosEliminar = funciones.EliminarInscripcionAspirante(loginData.idEliminar);
        //console.log('valor de mensajeVerInscritosEliminar: ' + mensajeVerInscritosEliminar);
        //console.log("Entre a mensajeVerInscritos curso");
        ///
        let cedulaBuscada = req.session.cedula;
        let idCursoBuscado = parseInt(req.body.idEliminar);
            Inscrito.findOneAndDelete({cedula : cedulaBuscada, idCurso :idCursoBuscado}, (err, resultados) => {
        if (err){console.log('error al eliminar inscrito');
                                return res.render('aspirante', {                    
                                mensajeVerInscritosEliminar: "Se presentaron incovenientes en el proceso por favor vuelva a intentar"
                                })
        }
        if(!resultados){
            console.log('No hay resultados para eliminar');
            return res.render('aspirante', {                    
                    mensajeVerInscritosEliminar: "No hay resultados para eliminar"
                })
        }
            console.log('Eliminado exitosamente');
            return res.render('aspirante', {                    
                    mensajeVerInscritosEliminar: "Curso "+ idCursoBuscado +"Eliminado exitosamente"
                })
    })  
        ///
    }
    /*res.render('aspirante', {
        id: parseInt(req.body.id),
        idEliminar: parseInt(req.body.idEliminar),
        mensajeVerInscritosEliminar: mensajeVerInscritosEliminar,
        mensajeMatricular : mensajeMatricular
    })*/
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

app.post('/asignarDocente', (req, res) => {
    Usuario.findOne({cedula: parseInt(req.body.documento)}, (err, respuesta) => {
        if (err) {            
            return console.log(err)
        }
        console.log(respuesta);
        if(!respuesta){
            Curso.find({}).exec((err, resultado) => {
                if (err) {
                    return console.log(err)
                }
                res.render('mostrarCursos', {
                    mostrar: "Documento del docente incorrecto por favor validar",
                    listado: resultado
                })
            })
        } else{
            Curso.findOneAndUpdate({idcurso : parseInt(req.body.id)}, {estado: "Cerrado", docente:  parseInt(req.body.documento)}, (err, resultado) => {
                if (err){
                    return console.log(err)
                }
        
                if(!resultado){
                    res.render ('asignarDocente', {
                        mostrar : "No se encontro el id del curso"			
                })        
                } else{        
                    Curso.find({}).exec((err, resultado) => {
                        if (err) {
                            return console.log(err)
                        }
                        res.render('mostrarCursos', {
                            mostrar: "Docente asignado con exito",
                            listado: resultado
                        })
                    })
                }
            })
        }
    })    
});


app.get('*', (req, res) => {
    res.render('error')
});

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



