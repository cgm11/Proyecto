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
