const hbs = require('hbs');
const funciones = require('./funciones');
listaUsuarios = [];
const fs = require('fs');

hbs.registerHelper('registrarUsuario',(correo,cedula,nombre,telefono)=>{
    var resultado = "";
    funciones.intentoRegistro(correo,cedula,nombre,telefono,"aspirante",function (result)
    {
    console.log('valor de resultado final es: '+result);
    resultado = result;
    return ("El resultado es: "+ resultado);
    })

return resultado;

});

hbs.registerHelper('crearCursos',(id, nombre, modalidad, valor, descripcion, intensidad, estado)=>{    
    var resultado = "";
    resultado = funciones.crearCursos(id, nombre, modalidad, valor, descripcion, intensidad, estado);
    return resultado;
})

hbs.registerHelper('crearTablaCursos',() => {
    let resultado =  funciones.crearTablaCursos();
    return resultado;
})

hbs.registerHelper('mostrarCursosAspirante',() => {
    let resultado =  funciones.mostrarCursosAspirante();
    return resultado;
})

hbs.registerHelper('listarUsuarios',() => {
    let resultado =  funciones.mostrarUsuarios();
    return resultado;
})

hbs.registerHelper('matricularUsuario',(id, cedula)=>{    
    console.log('Id: '+ id + 'cedula: '+cedula);
    var resultado = "";
    resultado = funciones.matricularUsuario(id, cedula);
    return resultado;
})
