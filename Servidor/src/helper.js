const hbs = require('hbs');
const funciones = require('./funciones');


hbs.registerHelper('registrarUsuario',(correo,cedula,nombre,telefono)=>{
    
    let resultado = funciones.intentoRegistro(correo,cedula,nombre,telefono);
    
    return "El resultado es: "+ resultado;

})

hbs.registerHelper('crearCursos',(id, nombre, modalidad, valor, descripcion, intensidad)=>{
    
    let resultado = funciones.crearCursos(id, nombre, modalidad, valor, descripcion, intensidad);
    
    return "El resultado es: "+ resultado;

})
