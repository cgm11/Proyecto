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

hbs.registerHelper('registrarUsuarioMongo',(correo,cedula,nombre,telefono)=>{
    var resultado = "";
    funciones.intentoRegistroMongo(correo,cedula,nombre,telefono,"aspirante",function (result)
    {
    console.log('valor de resultado final mongo es: '+result);
    resultado = result;
    return ("El resultado mongo es: "+ resultado);
    })

return resultado;

});

/*********** Validar si ya no lo necesito Caro
hbs.registerHelper('crearCursos',(id, nombre, modalidad, valor, descripcion, intensidad, estado)=>{    
    var resultado = "";
    resultado = funciones.crearCursos(id, nombre, modalidad, valor, descripcion, intensidad, estado);
    return resultado;
})*/

hbs.registerHelper('crearTablaCursos',(listado) => {
    let resultado =  funciones.crearTablaCursos(listado);
    return resultado;
})

hbs.registerHelper('crearTablaCursosDisponibles',() => {
    let resultado =  funciones.crearTablaCursosDisponibles();
    return resultado;
})

hbs.registerHelper('mostrarCursosAspirante',(listado) => {
    let resultado =  funciones.mostrarCursosAspirante(listado);
    return resultado;
})

hbs.registerHelper('listarUsuarios',() => {
    let resultado =  funciones.mostrarUsuarios();
    return resultado;
})

hbs.registerHelper('listarUsuariosNew', (listado) => {
    console.log("Entro a mostrarUsuarios en helper");
let texto = `   
        <table class='table table-striped table-bordered'> 
                <thead class='thead-dark'>
                <th>Cedula</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Telefono</th>
                <th>Rol</th>
                </thead>
                <tbody>`;
    if(listado.length>0){
    listado.forEach(estudiante =>{
        texto = texto + 
                `<tr>
                <td> ${estudiante.cedula} </td>
                <td> ${estudiante.nombre} </td>
                <td> ${estudiante.correo}</td>
                <td> ${estudiante.telefono} </td>
                <td> ${estudiante.rol} </td>
                
                </tr> `;
    })}
    texto = texto + '</tbody> </table></form>'; 
    return texto;

})

hbs.registerHelper('EditarCurso',() => {
    let resultado =  funciones.editarCurso();
    return resultado;
})

hbs.registerHelper('matricularUsuario',(id)=>{    
    var resultado = "";
    resultado = funciones.matricularUsuario(id);
    return resultado;
})

hbs.registerHelper('misCursos',(listadoMisCursos)=>{    
    var resultado = "";
    resultado = funciones.mostrarMisCursos(listadoMisCursos);
    return resultado;
})

hbs.registerHelper('mostrarDocentes',(listado, id) => {
    let resultado =  funciones.mostrarDocentes(listado, id);
    return resultado;
})

hbs.registerHelper('cursosDocente',(documento, listado) => {
    let resultado =  funciones.cursosDocente(documento, listado);
    return resultado;
})

