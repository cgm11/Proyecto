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
const sgMail = require('@sendgrid/mail');
const Usuario = require('./models/usuario');
const Curso = require('./models/cursos');
const Inscrito = require('./models/inscritos');
const bcrypt = require('bcrypt');
const session = require('express-session');
const multer  = require('multer');
var MemoryStore = require('memorystore')(session)
const avatarGenerico ='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'
const server = require('http').createServer(app);
const io = require('socket.io')(server);

//Paths
const directoriopublico = path.join(__dirname, '../Public');
const directoriopartials = path.join(__dirname, '../Partials');

//Static
app.use(express.static(directoriopublico));

hbs.registerPartials(directoriopartials);

const { UsuariosChat } = require('./usuarioChat');
const usuariosChat = new UsuariosChat();

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
app.use(bodyParser.urlencoded({
    extended: false
}));

//hbs
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    //funciones.borrarDocumentoGlobal();
    let avatar=avatarGenerico;
        res.render('index', {
        mensajeUsuario: "",
        avatar: avatar
    })

});

app.post('/ingreso', (req, res) => {
    let rolEncontrado = '';
    let avatar=avatarGenerico;
        Usuario.findOne({nombreUser : req.body.nombreUser}, (err, resultados) => {
        if (err){
            return console.log(err)
        }
        if(!resultados){
            //console.log(resultados);
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
            //console.log(resultados);
            req.session.usuario = resultados._id;
            req.session.nombre = resultados.nombre;
            req.session.cedula = resultados.cedula;
            req.session.correo = resultados.correo;
            req.session.telefono = resultados.telefono;
            req.session.rol = resultados.rol;
            req.session.nombreUser = resultados.nombreUser;
            if(resultados.avatar){
            avatar = resultados.avatar.toString('base64');
            //console.log("si hay avatar"+avatar)
        }else{//console.log('no hay imagen');
        //avatar=avatar;
             }
        req.session.avatar = avatar
    rolEncontrado = resultados.rol;

    //avatar = resultados.avatar.toString('base64');
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
                        listadoMisCursos: aux,
                        avatar: avatar
                    })
                })
                
            })
        } else if(rolEncontrado == "coordinador")  {
            res.render('coordinador', {
                correo: resultados.correo,
                cedula: resultados.documento,
                avatar: avatar
            })
        } else {
            Curso.find({docente: parseInt(req.session.cedula)}).exec((err, resultado) => {
                if (err) {
                    return console.log(err)
                }
                Inscrito.find({idCurso: ""}).exec((err, result) => {
                    if (err) {
                        return console.log(err)
                    }
                    res.render('docente', {
                        listado: resultado,   
                        listaIncritos: result,
                        avatar: avatar                    
                    })
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
    let avatar=avatarGenerico;
        res.render('registro',{
        avatar: avatar
    })
});

app.get('/coordinador', (req, res) => {
    //console.log('entre a get en coordinador, valor de sesion de avatar: '+req.session.avatar)
    let avatar=avatarGenerico;
        res.render('coordinador',{
        avatar: req.session.avatar
    })
});

app.get('/crearCurso', (req, res) => {
    res.render('crearCurso',{
        avatar: req.session.avatar
    })
});
 
var upload = multer({
limits: {
    fileSize: 10000000
},
    fileFilter (req, file, cb) {
  cb(null, true)
 
}
})

app.post('/listaCursos', upload.single('archivo') ,(req, res) => {
    //console.log("la extension del archivo es: "+ req.file.originalname);
    let mensajeUsuario = '';
    let mensajeImagen = '';
    let avatar=''
    let loginData = {
        //
        correo: req.body.correo,
        cedula: parseInt(req.body.documento),
        nombre: req.body.nombre,
        telefono: req.body.telefono,
    }
    //let avatar;
    
    if(req.file){
        if(!req.file.originalname.match(/\.(jpg|png|jpeg)$/)){
         mensajeImagen = ', formato de imagen de perfil no valido, para cambiar la imagen solicite editar al coordinador';
         }else{
        avatar = req.file.buffer;}}
    else{//console.log("no hay imagen");
        mensajeImagen = ', sin imagen de perfil, para agregar la imagen solicite editar al coordinador';
        avatar ="";}
    let usuario = new Usuario({
        nombre: req.body.nombre,
        cedula: parseInt(req.body.documento),
        correo: req.body.correo,
        telefono: req.body.telefono,
        rol: "aspirante",
        nombreUser : req.body.nombreUser,
        password : bcrypt.hashSync(req.body.password, 10),
        avatar : avatar
    })
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
            }else{
            const msg = {
              to: usuario.correo,
              from: 'andreslor95@hotmail.com',
              subject: 'Respuesta solicitud',
              text: 'Registro Exitoso, FELICITACIONES',
              html: '<strong>' +usuario.nombre +', Se ha registrado exitosamente en la plataforma de estudio, recuerde su usuario es: '+usuario.nombreUser+'</strong>',
            };
            sgMail.send(msg);
            return res.render('listaCursos', {
            nombre: loginData.nombre,
            resultadoNuevo: 'Ingreso Exitoso' + mensajeImagen,
            avatar : avatarGenerico
            })
            }})
        }else{
            avatar = avatarGenerico;
            return res.render ('index', {
            mensajeUsuario : "Usuario ya registrado",
            avatar: avatar          
            })
        }
    })
    
});

app.get('/verInscritos', (req, res) => {
    let listaCursos = [];
    //console.log('entre a get de verInscritos');
    Curso.find({}).exec((err, resultado) => {
        if (err) {
            return console.log(err)
        }
        res.render('verInscritos', {
            cursosDisponibles: resultado,
            listaInscritos: listaCursos,
            avatar: req.session.avatar
        })
    })
    //res.render('verInscritos')
})



app.post('/verInscritos', (req, res) => {
    let listaCursos = [];
    let mensajeVerInscritos = '';
    let cursosDisponibles = '';
    let mensajeVerInscritosEliminar = '';
    let loginData = {
        idCurso: parseInt(req.body.idCurso),
        cedula: parseInt(req.body.cedulaUsuario),
        idCursoVer: parseInt(req.body.idCursoVer),
        listaInscritos:{}
    }
    //console.log('idCursoVer: ' + loginData.idCursoVer + ', cedula: ' + loginData.cedula + ' y idCurso: ' + loginData.idCurso);
    if (!isNaN(loginData.cedula) && (!isNaN(loginData.idCurso))) {
        //console.log("Entre a mensajeVerInscritosEliminar ");
        ///
        let cedulaBuscada = loginData.cedula;
        let idCursoBuscado = loginData.idCurso;
        Inscrito.findOneAndDelete({cedula : cedulaBuscada, idCurso :idCursoBuscado}, (err, resultados) => {
        if (err){
            //console.log('error al eliminar inscrito');
            Curso.find({}).exec((err, resultado) => {
            if (err) {
            return console.log(err)
            }
            res.render('verInscritos', {
            cursosDisponibles: resultado,
            mensajeVerInscritosEliminar:mensajeVerInscritosEliminar,
            listaInscritos: listaCursos,
            avatar: req.session.avatar
            })
            })
        }
        if(!resultados){
            //console.log('No hay resultados para eliminar');
            Curso.find({}).exec((err, resultado) => {
            if (err) {
            return console.log(err)
            }
            res.render('verInscritos', {
            cursosDisponibles: resultado,
            mensajeVerInscritosEliminar: 'No hay resultados para eliminar',
            listaInscritos: listaCursos,
            avatar: req.session.avatar
            })
            })
        }else{
            //console.log('Eliminado exitosamente');
            Curso.find({}).exec((err, resultado) => {
            if (err) {
            return console.log(err)
            }
            Inscrito.find({}).exec((err, resultadito) => {
            if (err) {
            return console.log(err)
            }
            res.render('verInscritos', {
            cursosDisponibles: resultado,
            mensajeVerInscritosEliminar: 'Eliminado exitosamente',
            mensajeVerInscritos: loginData.idCurso,
            listaInscritos: resultadito,
            avatar: req.session.avatar
        })
            })
            })
        }
        })  
        ///
        //mensajeVerInscritosEliminar = funciones.mensajeVerInscritosEliminar(loginData.idCurso, loginData.cedula);
        //console.log('valor de mensajeVerInscritosEliminar: ' + mensajeVerInscritosEliminar);
        //console.log("Entre a mensajeVerInscritos curso");
        //mensajeVerInscritos = funciones.VerInscritos(loginData.idCurso);
    } else if (!isNaN(loginData.idCursoVer)) {
            //console.log("Entre a mensajeVerInscritos curso");
            Curso.find({}).exec((err, resultado) => {
            if (err) {
            return console.log(err)
            }
            Inscrito.find({}).exec((err, resultadito) => {
            if (err) {
            return console.log(err)
            }
            res.render('verInscritos', {
            cursosDisponibles: resultado,
            mensajeVerInscritos: loginData.idCursoVer,
            listaInscritos: resultadito,
        avatar: req.session.avatar
    })
            })
            })
            //mensajeVerInscritos = funciones.VerInscritos(loginData.idCurso);
        }
    else{
        Curso.find({}).exec((err, resultado) => {
            if (err) {
            return console.log(err)
            }
            res.render('verInscritos', {
            cursosDisponibles: resultado,
            mensajeVerInscritos: loginData.idCurso,
            listaInscritos:'',
            avatar: req.session.avatar
            })
            })
    }
})

app.post('/mostrarCursos', (req, res) => {
    let loginData = {
        idCurso: parseInt(req.body.idCurso),
        estado: req.body.estado
    }

    if (!isNaN(loginData.idCurso)) {
        //console.log("Entre a Editar curso");  
        Curso.findOne({idcurso : parseInt(req.body.idCurso)}, (err, resultados) => {
            if(err){
                 res.render('mostrarCursos', {                    
                     mostrar: "Se presentaron incovenientes en el proceso de actualizar por favor vuelva a intentar",
                     avatar: req.session.avatar
                 })
             }
             if(!resultados){
                Curso.find({}).exec((err, resultado) => {
                    if (err) {
                        return console.log(err)
                    }
                    res.render('mostrarCursos', {
                        mostrar: "El id del curso no existe",
                        listado: resultado,
                        avatar: req.session.avatar
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
                                listado: resultado,
                                avatar: req.session.avatar
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
                            estado: req.body.estado,
                            avatar: req.session.avatar                           
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
                    mostrar: "Se presentaron incovenientes en el proceso por favor vuelva a intentar",
                    avatar: req.session.avatar
                })
            }
            if(resultados){
            return res.render('crearCurso', {                    
                mostrar: "El id del curso ya existe, por favor validar",
                avatar: req.session.avatar
            })
            }else{
                curso.save((err1, resultado) => {
                    if (err1) {
                        res.render('crearCurso', {                    
                            mostrar: "Se presentaron problemas creando el curso, \
                         por favor vuelva a intentarlo" + err1,
                         avatar: req.session.avatar
                        })
                    }
                    Curso.find({}).exec((err, resultado) => {
                        if (err) {
                            return console.log(err)
                        }
                        res.render('mostrarCursos', {
                            mostrar: "Curso creado con exito",
                            listado: resultado,
                            avatar: req.session.avatar
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
            listado: resultado,
            avatar: req.session.avatar
        })
    })
})

app.get('/calculos', (req, res) => {
    res.render('calculos')
})

app.get('/aspirante', (req, res) => {
    res.render('aspirante')
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
        //console.log('si entre al if para matricular');
        Curso.findOne({idcurso : parseInt(req.body.id)}, (err, resultados) => {
            //console.log('el valor de resultados para findOne de busqueda curso es: '+ resultados)
           if(err){
            //console.log('error al consultar curso');
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
                        mensajeMatricular: "Se presentaron incovenientes en el proceso por favor vuelva a intentar",
                        avatar: req.session.avatar
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
                            mensajeMatricular: "El id del curso no existe, por favor validar",
                            avatar: req.session.avatar
                        })
                    })
                }) 
            }else if(resultados.estado !='Disponible'){                
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
                            mensajeMatricular: "El curso no esta Disponible, por favor validar",
                            avatar: req.session.avatar
                        })
                    })
                }) 
            } else{
                let tamanoProblema = 0;
                nombreCurso = resultados.nombre;
                let cedulaBuscada = req.session.cedula;
                let idCursoBuscado = parseInt(req.body.id);
                //console.log('VOY A HACER LA CONSULTA CON idCurso: '+parseInt(req.body.id)+' y cedula: '+req.session.cedula);
                Inscrito.find({cedula : cedulaBuscada, idCurso :idCursoBuscado}, (erro, result) => {
                        //console.log('valor de resultadosInscrito: '+result)
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
                                        mensajeMatricular: "Se presentaron incovenientes en el proceso por favor vuelva a intentar",
                                        avatar: req.session.avatar
                                    })
                                })
                            })
                        }else if(!result){//console.log('Vamos bien por aca se puede matricular nueva opcion')
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
                                    avatar: req.session.avatar,
                                    mensajeMatricular: "El aspirante ya esta inscrito en este curso, por favor validar"
                                })
                            })
                        })
            }else{
                //console.log('Vamos bien por aca se puede matricular')
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
                            avatar: req.session.avatar,
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
                        avatar: req.session.avatar,
                        mensajeMatricular: "Matricula Exitosa"
                    })
                })
            })
            })
                
                }
            })
    }})
    }else if (!isNaN(loginData.idEliminar)) {
        //console.log("Entre a mensajeVerInscritosEliminar ");
        //mensajeVerInscritosEliminar = funciones.EliminarInscripcionAspirante(loginData.idEliminar);
        //console.log('valor de mensajeVerInscritosEliminar: ' + mensajeVerInscritosEliminar);
        //console.log("Entre a mensajeVerInscritos curso");
        ///
        let cedulaBuscada = req.session.cedula;
        let idCursoBuscado = parseInt(req.body.idEliminar);
            Inscrito.findOneAndDelete({cedula : cedulaBuscada, idCurso :idCursoBuscado}, (err, resultados) => {
        if (err){console.log('error al eliminar inscrito');
        ///
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
                                    avatar: req.session.avatar,
                                    mensajeVerInscritosEliminar: "Se presentaron incovenientes en el proceso por favor vuelva a intentar"
                                })
                            })
                        })
        ///
        }
        if(!resultados){
            //console.log('No hay resultados para eliminar');
            ///
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
                                    avatar: req.session.avatar,
                                    mensajeVerInscritosEliminar: "No hay resultados para eliminar"
                                })
                            })
                        })
        ///
        }else{
            //console.log('Eliminado exitosamente');
            ///
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
                                    avatar: req.session.avatar,
                                    mensajeVerInscritosEliminar: "Eliminado exitosamente"
                                })
                            })
                        })
                    }
        ///
           
    })  
        ///
    }else{
        ///
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
                                    avatar: req.session.avatar,
                                    listadoMisCursos: aux,
                                })
                            })
                        })
    }
});

var upload2 = multer({
limits: {
    fileSize: 10000000
},
    fileFilter (req, file, cb) {
        //console.log(file);
      
  cb(null, true)
 
  }
})
//app.post('/listaCursos', upload.single('archivo') ,(req, res) => {
app.post('/editarUsuario',upload2.single('archivoUpdate') ,(req, res) => {
    let mensajeEditarUsuario = '';
    let listaUsuariosMongo = [];
    let loginData = {
        correo: req.body.correo,
        cedula: parseInt(req.body.cedula),
        nombre: req.body.nombre,
        telefono: req.body.telefono,
        rol: req.body.rol
    }
    //console.log("valor de cedula: " + loginData.cedula)
    //if(req.file){console.log("valor de nombreImagen: " + req.file.originalname)}else{console.log('No hay imagen para editar')}
    let arregloUpdate = {};
    let avatar2 = '';
    let avatar = "avatar";
    if (!isNaN(loginData.cedula)) {
        //console.log("Entre a Editar usuario Mongo");
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
        if(req.file){
        if(!req.file.originalname.match(/\.(jpg|png|jpeg)$/)){
         //mensajeImagen = ', formato de imagen de perfil no valido, para cambiar la imagen ingrese a editar usuario';
         }else{
            //console.log('voy a asignar a avatar el buffer');
        avatar2 = req.file.buffer;
        //console.log(req.file);
        //console.log(arregloUpdate)
        arregloUpdate[avatar] = avatar2;
        }}
        //console.log(arregloUpdate)
        Usuario.findOneAndUpdate({cedula : parseInt(req.body.cedula)}, {$set:arregloUpdate}, {new : true, runValidators: true, context: 'query'}, (err, resultados) => {
            //  findOneAndUpdate({nombre :           req.body.nombre}, req.body,             {new : true, runValidators: true, context: 'query' }, (err, resultados) => {
        if (err){console.log('error al eliminar inscrito');
        ///
            Usuario.find({}).exec((err, resultado) => {
            if (err) {
            return console.log(err)
            }
            res.render('editarUsuario', {
            listado: resultado,
            mensajeEditarUsuario: "Se presentaron incovenientes en el proceso por favor vuelva a intentar",
            avatar: req.session.avatar
            })
            })
        } else if (!resultados){
            Usuario.find({}).exec((err, resultado) => {
            if (err) {
            return console.log(err)
            }
            res.render('editarUsuario', {
            listado: resultado,
            mensajeEditarUsuario: "No hay registros para actualizar",
            avatar: req.session.avatar
            })
            })
        } else {
            Usuario.find({}).exec((err, resultado) => {
            if (err) {
            return console.log(err)
            }
            res.render('editarUsuario', {
            listado: resultado,
            mensajeEditarUsuario: "Actualizacion exitosa de: "+loginData.cedula,
            avatar: req.session.avatar
            })
            })                    
        }

    })  

        //mensajeEditarUsuario = funciones.actualizarUsuario(loginData.cedula, loginData.nombre, loginData.correo, loginData.telefono, loginData.rol);
    }
   /* ///
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
*/
});
app.get('/editarUsuario', (req, res) => {
    Usuario.find({}, (err, respuesta) => {
        if (err) {
            return console.log(err)
        }

        res.render('editarUsuario', {
            listado: respuesta,
            avatar: req.session.avatar
        })
    })

})

app.post('/asignarDocente', (req, res) => {
    let mailDocente = "";
    Usuario.findOne({cedula: parseInt(req.body.documento)}, (err, respuesta) => {
        if (err) {            
            return console.log(err)
        }
        //console.log(respuesta);
        if(!respuesta){
            Curso.find({}).exec((err, resultado) => {
                if (err) {
                    return console.log(err)
                }
                res.render('mostrarCursos', {
                    mostrar: "Documento ingresado no existe",
                    listado: resultado,
                    avatar: req.session.avatar
                })
            })
        } else{
            if(respuesta.rol == "docente"){
                mailDocente = respuesta.correo;
                //console.log('el correo del profesor es: '+mailDocente);
                Curso.findOneAndUpdate({idcurso : parseInt(req.body.id)}, {estado: "Cerrado", docente:  parseInt(req.body.documento)}, (err, resultado) => {
                    if (err){
                        return console.log(err)
                    }
            
                    if(!resultado){
                        res.render ('asignarDocente', {
                            mostrar : "No se encontro el id del curso",
                            avatar: req.session.avatar		
                    })        
                    } else{        
                        Curso.find({}).exec((err, resultado) => {
                            if (err) {
                                return console.log(err)
                            }else{
                                const msg = {
                                  to: mailDocente,
                                  from: 'andreslor95@hotmail.com',
                                  subject: 'Asignacion grupo',
                                  text: 'Se le ha asignado un grupo por parte del coordinador',
                                  html: '<strong>'+ respuesta.nombre+' se le ha asignado el grupo: '+idcurso +' por parte del coordinador, '
                                  +'\n'+'recuerde preparar el curso y revisar la tematica</strong>',
                                };
                                sgMail.send(msg);
                            res.render('mostrarCursos', {
                                mostrar: "Docente asignado con exito",
                                listado: resultado,
                                avatar: req.session.avatar
                            })}
                        })
                    }
                })

            }else {
                Usuario.find({rol: "docente"}).exec((err, resultado) => {
                    if (err) {
                        return console.log(err)
                    }
                    Curso.find({}).exec((err, resultado) => {
                        if (err) {
                            return console.log(err)
                        }
                        res.render('mostrarCursos', {
                            mostrar: "El documento ingresado no pertenece a un docente",
                            listado: resultado,
                            avatar: req.session.avatar
                        })
                    })
                })
            }            
        }
    })    
})

app.post('/docente', (req, res) => {
    Curso.find({docente: parseInt(req.session.cedula)}).exec((err, resultado) => {
        if (err) {
            return console.log(err)
        }

        Inscrito.find({idCurso: parseInt(req.body.idver)}).exec((err, result) => {
            if (err) {
                return console.log(err)
            }
            res.render('docente', {
                listado: resultado,   
                listaIncritos: result,
                avatar: req.session.avatar                     
            })
        })

        
    })

})


app.get('/ingresoChat', (req, res) => {          
    
        res.render('ingresoChat', {
        })

})

let contador = 0 
    io.on('connection', client => {
//        console.log('un usuario se ha conectado')
//        client.emit('mensaje', 'Bienvenido')

//        client.on('mensaje', (informacion) => {
//            console.log(informacion)
//        })

        client.on('contador', () => {
            contador ++
            console.log(contador)
            io.emit('contador', contador)
        })

        client.on('usuarioNuevo', (usuario) => {
            let listado = usuariosChat.agregarUsuario(client.id, usuario)
            console.log(listado)
            let texto = `Se ha conectado ${usuario}`
            io.emit('nuevoUsuario', texto)
        })

        client.on('texto', (text, callback) => {
            io.emit('texto', (text))
            callback()
        })
    });

app.get('*', (req, res) => {
    res.render('error')
})

//app.listen(3000, () => {
//  console.log ('servidor en el puerto 3000')
//});

//Routers
//app.use(require('./routers/index'));
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

mongoose.connect(process.env.URLDB, {useNewUrlParser: true}, (err, resultados) => {
    if (err) {
        return console.log('error conectando usuarios' + err);
    }
    return console.log('conectado de mongodb');
});

server.listen(process.env.PORT, () => {
    console.log('servidor en el puerto: ' + process.env.PORT)
});