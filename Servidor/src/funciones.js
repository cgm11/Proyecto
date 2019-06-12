listaUsuarios = [];
listaCursos = [];
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

const crearCursos = (id, nombre, modalidad, valor, descripcion, intensidad, estado) => {
	listarOtro();
	let resultado = "";
	let crear = {
		id: id,
		nombre: nombre,
		modalidad: modalidad,
		valor: valor,
		descripcion: descripcion,
		intensidad: intensidad,
		estado: estado
	};
	if (listaCursos.length >= 1) {
		let duplicado = listaCursos.find(aux => aux.id == id)
		if (!duplicado) {
			listaCursos.push(crear);
			console.log("ENTRO A DUPLICADO");
			guardarCurso();
			resultado = "Curso creado con exito, nombre: "
			console.log('valor de resultado: ' + resultado);

		} else {
			console.log("Ya existe el id");
			resultado = "Ya existe el id, por favor validar"
		}
	} else {
		listaCursos.push(crear);
		console.log("ENTRO A NUEVO");
		console.log(listaCursos);
		guardarCurso();
		resultado = "Curso creado con exito, nombre: "
	}
	return resultado;
}

const guardarCurso = () => {
	let datos = JSON.stringify(listaCursos);
	fs.writeFile('ListadoCursos.json', datos, (err) => {
		if (err) throw (err)
		console.log('Archivo creado con exito, valor de mensaje: ');

	})
}

const listarOtro= () => {
	try {
		listaCursos = require('../ListadoCursos.json');
		console.log("entre al try en listar");
	} catch (error) {
		listaCursos = [];
		console.log("entre al catch en listar");
	}

}

const crearTablaCursos = () => {
	try {
		console.log("Entro");
		listarOtro();
		console.log("Paso listar");
		let texto = "<table class='table table-striped table-bordered'> \
					<thead> \
					<th> Id </th> \
					<th> Nombre </th> \
					<th> Modalidad </th> \
					<th> Valor </th> \
					<th> Descripción </th> \
					<th> Intensidad horaria </th> \
					<th> Estado </th> \
					</thead> \
					<tbody>";
		listaCursos.forEach(cur => {
			texto = texto +
				'<tr>' +
				'<td>' + cur.id + '</td>' +
				'<td>' + cur.nombre + '</td>' +
				'<td>' + cur.modalidad + '</td>' +
				'<td>' + cur.valor + '</td>' +
				'<td>' + cur.descripcion + '</td>' +
				'<td>' + cur.intensidad + '</td>' +
				'<td>' + cur.estado + '</td></tr>'
		})
		texto = texto + '</tbody></table>';
		return texto;
	} catch (error) {
		console.log("catch");
		return "Error";
	}
}

const mostrarCursosAspirante = () => {
	try {
		listarOtro();
		let texto = "";
		listaCursos.forEach(cur => {
			texto = texto + 
			'<div class="accordion" id="accordionExample"> \
				<div class="card"> \
						<div class="card-header" id="heading' + cur.id + '">  \
							<h2 class="mb-0"> \
							<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse' + cur.id + '" aria-expanded="false" aria-controls="collapse' + cur.id + '"> ' +
								'Nombre: ' + cur.nombre + '<br>Valor: ' + cur.valor +
							'</button> \
							</h2> \
						</div> \
						<div id="collapse' + cur.id + '" class="collapse" aria-labelledby="heading' + cur.id + '" data-parent="#accordionExample"> \
							<div class="card-body">' +
								'Descripción :' + cur.descripcion + '<br>Modalidad: ' + cur.modalidad + '<br>Valor: ' + cur.valor +
								'<br><br><button type="button">Registrarse</button> \
								</div> \
						</div> \
				</div> \
			</div>'
		})
		texto = texto;
		return texto;
	} catch (error) {
		console.log("catch");
		return "Error";
	}
}



module.exports = {
	registrarUsuario,
	intentoRegistro,
	guardar,
	crearCursos,
	guardarCurso,
	listar,
	listarOtro,
	crearTablaCursos,
	mostrarCursosAspirante,
	buscarDuplicado,
	retornarRol
}