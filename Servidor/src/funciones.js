listaUsuarios = [];
listaCursos = [];
listarMatricula = [];
const fs = require('fs');

let intentoRegistro = (correo, cedula, nombre, telefono, rol, callback) => {
	let resultado1 = "";
	registrarUsuario(correo, cedula, nombre, telefono, rol, function (resultado2) {
		console.log("el resultado otro es: " + resultado2);
		resultado1 = resultado2;
	})
	console.log("el resultado1 antes de return es: " + resultado1);
	callback(resultado1);
}

const registrarUsuario = (correo, cedula, nombre, telefono, rol, callback) => {
	listar();

	let resultado = "";
	let resultado2;
	let est = {
		nombre: nombre,
		cedula: cedula,
		correo: correo,
		telefono: telefono,
		rol: "aspirante"
	};
	let duplicado = listaUsuarios.find(nom => nom.cedula == est.cedula)
	console.log("valor de duplicado: " + duplicado);
	if (!duplicado) {
		listaUsuarios.push(est);
		let respuestaNew = guardar()
		resultado2 = respuestaNew;
	}
	else { resultado2 = "USUARIO YA EXISTE"; }
	console.log('valor de resultado2: ' + resultado2);
	callback(resultado2);
}

const buscarDuplicado = (data) => {
	listar();
	let busquedaDuplicado = listaUsuarios.find(nom => nom.cedula == data.cedula)
	//console.log("valor de busquedaDuplicado: "+ busquedaDuplicado);
	return busquedaDuplicado;
}

const retornarRol = (data) => {
	listar();
	let busquedaRol = listaUsuarios.find(nom => nom.cedula == data.cedula)
	if (busquedaRol != null)
		console.log("valor de Rol: " + busquedaRol.rol);
	return busquedaRol.rol;
}

const guardar = () => {
	let mensaje = 'prueba';
	let datos = JSON.stringify(listaUsuarios);
	mensaje = 'exitoso';
	fs.writeFile('ListadoUsuarios.json', datos, (err) => {
		mensaje = 'prueba3';
		if (err) {
			throw (err); mensaje = "ERROR AL INSERTAR";
		}
		else {
			mensaje = "INGRESO CORRECTO";
			console.log('Archivo creado con exito, valor de mensaje: ' + mensaje);
		}
	})
	return mensaje
}

const listar = () => {
	try {
		listaUsuarios = require('../ListadoUsuarios.json');
	} catch (error) {
		listaUsuarios = [];
	}
}

const crearCursos = (id, nombre, modalidad, valor, descripcion, intensidad, estado) => {
	listarOtro();
	let respuestaNew = "";
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
	if (!id == null | !id == "") {
		if (listaCursos.length >= 1) {
			let duplicado = listaCursos.find(aux => aux.id == id)
			if (!duplicado) {
				listaCursos.push(crear);
				console.log("ENTRO A DUPLICADO");
				respuestaNew = guardarCurso();
				resultado = "Curso creado con exito, nombre: "
				console.log('valor de resultado: ' + resultado + " y respuestaNew: " + respuestaNew);

			} else {
				console.log("Ya existe el id");
				resultado = "Ya existe el id, por favor validar"
			}
		} else {
			listaCursos.push(crear);
			console.log("ENTRO A NUEVO");
			console.log(listaCursos);
			respuestaNew = guardarCurso();
			resultado = "Curso creado con exito, nombre: ";
			console.log('valor de resultado: ' + resultado + " y respuestaNew: " + respuestaNew);
		}
	} else {
		resultado = "No se guarda registro"
		console.log('No se guarda registro')
	}
	return resultado;
}

const guardarCurso = () => {
	let mensaje = 'prueba';
	let datos = JSON.stringify(listaCursos);
	mensaje = 'exitoso';
	fs.writeFile('ListadoCursos.json', datos, (err) => {
		if (err) throw (err)
		console.log('Archivo creado con exito, valor de mensaje: ');

	})
	return mensaje;
}

const listarOtro = () => {
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

const crearTablaCursosDisponibles = () => {
	try {
		console.log("Entro a crearTablaCursosDisponibles");
		listarOtro();
		//let existe = listaCursos.find(nom => nom.estado == 'Disponible')
		//existe.forEach(cur => {
		//console.log('valor de id: '+existe.id)})
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
			if(cur.estado == 'Disponible'){
			texto = texto +
				'<tr>' +
				'<td>' + cur.id + '</td>' +
				'<td>' + cur.nombre + '</td>' +
				'<td>' + cur.modalidad + '</td>' +
				'<td>' + cur.valor + '</td>' +
				'<td>' + cur.descripcion + '</td>' +
				'<td>' + cur.intensidad + '</td>' +
				'<td>' + cur.estado + '</td></tr>'}
		})
		texto = texto + '</tbody></table>';
		return texto;
	} catch (error) {
		console.log("catch, Error: "+error);
		return "Error";
	}
}

const VerInscritos = (idCurso) => {
	try {
		console.log("Entro a VerInscritos");
		listarMatriculas();
		//let existe = listaCursos.find(nom => nom.estado == 'Disponible')
		//existe.forEach(cur => {
		//console.log('valor de id: '+existe.id)})
		let texto = '<table class="table table-striped table-bordered"> \
					<thead> \
					<th> Cedula </th> \
					</thead> \
					<tbody>';
		listarMatricula.forEach(cur => {
			if(cur.id == idCurso){
			texto = texto +
				'<tr>' +
				'<td>' + cur.cedula + '</td></tr>'}
		})
		texto = texto + '</tbody></table>';
		return texto;
	} catch (error) {
		console.log("catch, Error: "+error);
		return "Error";
	}
}

const mostrarCursosAspirante = () => {
	try {
		listarOtro();
		let texto = "";
		listaCursos.forEach(cur => {
			if (cur.estado == 'Disponible') {
				texto = texto +
					'<div class="accordion" id="accordionExample"> \
				<div class="card"> \
						<div class="card-header" id="heading' + cur.id + '">  \
							<h2 class="mb-0"> \
							<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse' + cur.id + '" aria-expanded="false" aria-controls="collapse' + cur.id + '">' +
					'Nombre: ' + cur.nombre + '<br>Valor: ' + cur.valor + '<br>Descripción: ' + cur.descripcion +
					'</button> \
							</h2> \
						</div> \
						<div id="collapse' + cur.id + '" class="collapse" aria-labelledby="heading' + cur.id + '" data-parent="#accordionExample"> \
							<div class="card-body">' +
					'Id curso: ' + cur.id + '<br>Descripción :' + cur.descripcion + '<br>Modalidad: ' + cur.modalidad + '<br>Valor: ' + cur.valor +
					'</div> \
						</div> \
				</div> \
			</div>'
			}
		})
		texto = texto;
		return texto;
	} catch (error) {
		console.log("catch");
		return "Error";
	}
}

const mostrarUsuarios = () => {
	try {
		console.log("Entro a mostrarUsuarios");
		listar();
		console.log("Paso listar");
		let texto = "<table class='table table-striped table-bordered'> \
					<thead> \
					<th> Cedula </th> \
					<th> Nombre </th> \
					<th> Correo </th> \
					<th> Telefono </th> \
					<th> Rol </th> \
					</thead> \
					<tbody>";
		listaUsuarios.forEach(user => {
			texto = texto +
				'<tr>' +
				'<td>' + user.cedula + '</td>' +
				'<td>' + user.nombre + '</td>' +
				'<td>' + user.correo + '</td>' +
				'<td>' + user.telefono + '</td>' +
				'<td>' + user.rol + '</td></tr>'
		})
		texto = texto + '</tbody></table>';
		return texto;
	} catch (error) {
		console.log("catch");
		return "Error";
	}
}

const actualizarUsuario = (cedula, nombreNew, correoNew, telefonoNew, rolNew) => {
	let mensajeRetorno = '';
	listar()
	let existe = listaUsuarios.find(nom => nom.cedula == cedula)
	if (existe) {
		if (nombreNew != null && nombreNew != "") {
			let nombre = "nombre";
			console.log('valores de existe, nombre ' + existe.nombre);
			existe[nombre] = nombreNew;
		}
		if (correoNew != null && correoNew != "") {
			let correo = "correo";
			console.log('valores de existe, correo ' + existe.correo);
			existe[correo] = correoNew;
		}
		if (telefonoNew != null && telefonoNew != "") {
			let telefono = "telefono";
			console.log('valores de existe, telefono ' + existe.telefono);
			existe[telefono] = telefonoNew;
		}
		if (rolNew != null && rolNew != "" && rolNew != "-") {
			let rol = "rol";
			console.log('valores de existe, rol ' + existe.rol);
			existe[rol] = rolNew;
		}
		mensajeRetorno = guardar()
	} else {
		console.log('No hay usuario con esa cedula');
		mensajeRetorno = 'Cambio no exitoso, no hay usuario con esa cedula';
	}
	return ('Resultado editar: ' + mensajeRetorno);
}

const mensajeVerInscritosEliminar = (idCurso, cedula) =>{
	let mensajeRetorno = '';
	listarFinal = [];
	listarMatriculas();
	//listarMatricula.forEach(user => {
	//		console.log('hay originalmente elemento con idCurso: '+user.id+' y cedula: '+user.cedula)
	//	})
	let existe = listarMatricula.find(nom => nom.id == idCurso && nom.cedula == cedula);
	if(existe){
		let filterNew = listarMatricula.filter(nom => ((nom.id !== idCurso) || (nom.cedula !== cedula)));
	//	filterNew.forEach(user => {
	//		console.log('quedo elemento con idCurso: '+user.id+' y cedula: '+user.cedula)
	//	})
		if(filterNew.length == listarMatricula.length){
		console.log('no se elimino a nadie');
		mensajeRetorno = 'no se elimino a nadie';
		}else{
		listarMatricula = filterNew;
		guardarMatricula()
		mensajeRetorno = 'Eliminado exitosamente!!';
		}
	}else{
		mensajeRetorno = 'No hay registros con el id y cedula ingresados para eliminar';
	}
console.log('antes del retorno en mensajeVerInscritosEliminar: '+mensajeRetorno);
return 	mensajeRetorno;

}

const listarMatriculas = () => {
	try {
		listarMatricula = require('../ListaInscritos.json');
	} catch (error) {
		listarMatricula = [];
	}
}

const matricularUsuario = (id, cedula) => {
	let mensajeRetorno = '';
	listarMatriculas()
	listar();
	let respuestaNew = "";
	let resultado = "";
	let crear = {
		id: id,
		cedula: cedula
	};
	if (id == null || id == 'undefined') {
		console.log('NO ENTRO A MATRICULAR');
	} else {
		let cursoExiste = listaCursos.find(aux => aux.id == crear.id);
		let duplicadoMatricula = listarMatricula.find(nom => nom.cedula == crear.cedula && nom.id == crear.id);
		if (cursoExiste) { //Valido si el curso existe
			if (!duplicadoMatricula) {
				if(cursoExiste.estado=='Cerrado'){
					resultado= 'Matricula no exitosa: Curso Cerrado.';
				}else{
				listarMatricula.push(crear);
				console.log("ENTRO A MATRICULAR USUARIO");
				respuestaNew = guardarMatricula();
				resultado = "Matricula exitosa ";
				console.log('valor de resultado: ' + resultado + " y respuestaNew: " + respuestaNew);}
			} else {
				resultado = "El usuario ya está inscrito en el curso";
				console.log("El usuario ya está inscrito en el curso");
			}
		} else {
			resultado = "El curso no existe";
			console.log("El curso no existe");
		}
	}
	return resultado;
}

const guardarMatricula = () => {
	let mensaje = 'prueba';
	let datos = JSON.stringify(listarMatricula);
	mensaje = 'exitoso';
	fs.writeFile('ListaInscritos.json', datos, (err) => {
		if (err) throw (err)
		console.log('Archivo creado con exito, valor de mensaje: ');

	})
	return mensaje;
}

const editarCurso = (idCurso, estadoNew) =>{
	try {
		listarOtro();
		let mensajeRetorno = '';
		let existe = listaCursos.find(nom => nom.id == idCurso)
		if(existe){
			if(estadoNew!=null && estadoNew!=""&&estadoNew!="-")
			{let estado="estado";
			console.log('valores de existe, estado '+existe.estado);
			existe[estado]=estadoNew;}
			mensajeRetorno = guardarCurso();
			mensajeRetorno = 'Resultado editar: '+ mensajeRetorno;
		}else{
			if(isNaN(idCurso)){
				mensajeRetorno = '';
			}else{
				console.log('No hay curso con ese id');
				mensajeRetorno = 'Resultado editar: '+ 'Cambio no exitoso, no hay curso con ese id';}
		}
		return mensajeRetorno;
	}catch{
		mensajeRetorno = 'Error, favor consulta con un admin';
		return mensajeRetorno;
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
	crearTablaCursosDisponibles,
	mostrarCursosAspirante,
	buscarDuplicado,
	retornarRol,
	mostrarUsuarios,
	actualizarUsuario,
	editarCurso,
	matricularUsuario,
	guardarMatricula,
	VerInscritos,
	mensajeVerInscritosEliminar
}