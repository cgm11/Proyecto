const hbs = require('hbs');
const funciones = require('./funciones');


hbs.registerHelper('registrarUsuario',(correo,cedula,nombre,telefono)=>{
    
    let resultado = funciones.intentoRegistro(correo,cedula,nombre,telefono);
    
    return "El resultado es: "+ resultado;

})

hbs.registerHelper('crearCursos',(id, nombre, modalidad, valor, descripcion, intensidad, estado)=>{    
    
    funciones.crearCursos(id, nombre, modalidad, valor, descripcion, intensidad, estado);
})

hbs.registerHelper('crearTablaCursos',() => {
    let resultado =  funciones.crearTablaCursos();
    return resultado;
})

hbs.registerHelper('mostrarCursosAspirante',() => {
    let resultado =  funciones.mostrarCursosAspirante();
    return resultado;
})
