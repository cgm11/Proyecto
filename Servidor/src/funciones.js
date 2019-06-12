listaUsuarios = [];
const fs = require('fs');
let intentoRegistro =  (correo, cedula, nombre,telefono, rol, callback) =>{
	let resultado1="";
	registrarUsuario(correo, cedula, nombre,telefono, rol, function(resultado2)
	{
		console.log("el resultado otro es: "+resultado2);
		resultado1 = resultado2;		
	})
	console.log("el resultado1 antes de return es: "+resultado1);
	callback (resultado1);
}
const registrarUsuario = (correo, cedula, nombre,telefono, rol,callback) =>{
	listar();

	let resultado = "";
	let	resultado2;
	let est = {
        nombre: nombre,
        cedula: cedula,
        correo: correo,
        telefono: telefono,
        rol: "aspirante"
    };
    let duplicado = listaUsuarios.find(nom => nom.cedula == est.cedula)
    console.log("valor de duplicado: "+ duplicado);
    if(!duplicado){
    listaUsuarios.push(est);
    let respuestaNew = guardar()
		resultado2 = respuestaNew;}
	else{resultado2 = "USUARIO YA EXISTE";}
		console.log('valor de resultado2: '+resultado2);
		callback (resultado2);
}
const buscarDuplicado = (data) => {
	listar();
	let busquedaDuplicado = listaUsuarios.find(nom => nom.cedula == data.cedula)
    console.log("valor de busquedaDuplicado: "+ busquedaDuplicado);
    return busquedaDuplicado;
}

const retornarRol =(data)=>{
	listar();
	let busquedaRol = listaUsuarios.find(nom => nom.cedula == data.cedula)
	if(busquedaRol != null)
    console.log("valor de Rol: "+ busquedaRol.rol);
    return busquedaRol.rol;
}

const guardar = () => {
	let mensaje='prueba';
	let datos = JSON.stringify(listaUsuarios);
	mensaje='exitoso';
	fs.writeFile('ListadoUsuarios.json',datos, (err)=>{
		mensaje='prueba3';
		if(err){ 
			throw (err); mensaje = "ERROR AL INSERTAR";
			}
		else{ mensaje = "INGRESO CORRECTO";
			console.log('Archivo creado con exito, valor de mensaje: '+mensaje);}
	})
	return mensaje
}
const listar = ()=>{
	try{
	listaUsuarios = require('../ListadoUsuarios.json');
	} catch(error){
		listaUsuarios=[];
	}
}
module.exports = {
	registrarUsuario,
	intentoRegistro,
	guardar,
	buscarDuplicado,
	retornarRol
}