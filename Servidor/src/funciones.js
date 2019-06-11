listaUsuarios = [];
listaCursos = [];
const fs = require('fs');
let intentoRegistro =  (correo, cedula, nombre,telefono, rol) =>{
	registrarUsuario(correo, cedula, nombre,telefono, rol, function(guardar)
	{
		console.log("el resultado otro es: "+resultado);
	})
}
const registrarUsuario = (correo, cedula, nombre,telefono, rol,callback) =>{
	let resultado = "";
	let est = {
        nombre: nombre,
        cedula: cedula,
        correo: correo,
        telefono: telefono,
        rol: "aspirante"
    };
    listaUsuarios.push(est);
    //console.log(listaUsuarios);
    resultado = guardar();
    
    console.log('valor de resultado: '+resultado);
    callback (resultado);
}

const guardar = () => {
	let mensaje="";
	let datos = JSON.stringify(listaUsuarios);
	fs.writeFile('ListadoUsuarios.json',datos, (err)=>{
		if(err){ throw (err); mensaje = "ERROR AL INSERTAR"}
		else{ mensaje = "INGRESO CORRECTO";
			console.log('Archivo creado con exito, valor de mensaje: '+mensaje);}
	})
	return mensaje;
}

const crearCursos = (id, nombre, modalidad, valor, descripcion, intensidad, callback) =>{
	let resultado = "";
	let crear = {
		id: id,
        nombre: nombre,
        modalidad: modalidad,
        valor: valor,
        descripcion: descripcion,
		intensidad: intensidad,
		estado: "Disponible"
	};
	let duplicado = listaCursos.find(aux => aux.id == id)
	if(!duplicado){
    listaCursos.push(crear);
    //console.log(listaUsuarios);
    resultado = guardarCurso();
    
    console.log('valor de resultado: '+resultado);
	callback (resultado);
	}else{
		console.log("Ya existe el id");
	}
}

const guardarCurso = () => {
	let mensaje="";
	let datos = JSON.stringify(listaCursos);
	fs.writeFile('ListadoCursos.json',datos, (err)=>{
		if(err){ throw (err); mensaje = "ERROR AL INSERTAR"}
		else{ mensaje = "INGRESO CORRECTO";
			console.log('Archivo creado con exito, valor de mensaje: '+mensaje);}
	})
	return mensaje;
}

module.exports = {
	registrarUsuario,
	intentoRegistro,
	guardar,
	crearCursos,
	guardarCurso
}