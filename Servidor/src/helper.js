const hbs = require('hbs');
const funciones = require('./funciones');


hbs.registerHelper('registrarUsuario',(correo,cedula,nombre,telefono)=>{
    
    let resultado = funciones.intentoRegistro(correo,cedula,nombre,telefono);
    
    return "El resultado es: "+ resultado;

})
