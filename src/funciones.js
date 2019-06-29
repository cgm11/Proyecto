listaUsuarios = [];
listaUsuariosMongo = [];
listaCursos = [];
listarMatricula = [];
const fs = require('fs');
let cedulaGlobal = "";
const Usuario = require('./models/usuario');
const Curso = require('./models/cursos');
const Inscrito = require('./models/inscritos');

let intentoRegistro = (correo, cedula, nombre, telefono, rol, callback) => {
	let resultado1 = "";
	registrarUsuario(correo, cedula, nombre, telefono, rol, function (resultado2) {
		console.log("el resultado otro es: " + resultado2);
		resultado1 = resultado2;
	})
	console.log("el resultado1 antes de return es: " + resultado1);
	callback(resultado1);
}

let intentoRegistroMongo = (correo, cedula, nombre, telefono, rol, callback) => {
	let resultado1 = "";
	registrarUsuarioMongo(correo, cedula, nombre, telefono, rol, function (resultado2) {
		console.log("el resultado otro mongo es: " + resultado2);
		resultado1 = resultado2;
	})
	console.log("el resultado1 antes de return mongo es: " + resultado1);
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

const registrarUsuarioMongo = (correo, cedula, nombre, telefono, rol, callback) => {
	//listar();

	//let resultado = "";
	let resultado2 = "Ingreso Exitoso";
	let usuario = new Usuario ({
		nombre: nombre,
		cedula: cedula,
		correo: correo,
		telefono: telefono,
		rol: "aspirante"
	})

	usuario.save( (err, resultado) => {
		if(err){
			resultado2 = "ERROR EN GUARDADO DE MONGO";
		}
		resultado2 = ("Ingreso exitoso: "+resultado);
		console.log('el valor de resultado en mongo es: '+ resultado +', error: '+ err)
	})
	console.log('el valor de resultado2 en mongo es: '+ resultado2)
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
				resultado = "Curso creado con exito!!"
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
			resultado = "Curso creado con exito!!";
			console.log('valor de resultado: ' + resultado + " y respuestaNew: " + respuestaNew);
		}
	} else {
		console.log('No se guarda registro');
		//resultado = "No se guarda registro"
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

const crearTablaCursos = (listar) => {
	try {
		console.log("Entro");
		console.log("Paso listar");
		let texto = `<table class='table table-striped table-bordered'> 
					<thead> 
					<th> Id </th> 
					<th> Nombre </th> 
					<th> Modalidad </th> 
					<th> Valor </th> 
					<th> Descripción </th> 
					<th> Intensidad horaria </th> 
					<th> Estado </th> 
					</thead> 
					<tbody>`;
			listar.forEach(curso => {
			texto = texto +
				`<tr>
				<td> ${curso.idcurso} </td>
				<td> ${curso.nombre} </td>
				<td> ${curso.modalidad} </td>
				<td> ${curso.valor} </td>
				<td> ${curso.descripcion} </td>
				<td> ${curso.intensidad} </td>
				<td> ${curso.estado} </td></tr>`
		})
		texto = texto + '</tbody></table>';
		return texto;
	} catch (error) {
		console.log("catch");
		return "Error";
	}
}

const crearTablaCursosDisponibles = (cursosDisponibles) => {
	try {
		console.log("Entro a crearTablaCursosDisponibles");
		//listarOtro();
		//let existe = listaCursos.find(nom => nom.estado == 'Disponible')
		//existe.forEach(cur => {
		//console.log('valor de id: '+existe.id)})
		console.log("valor de cursosDisponibles: "+cursosDisponibles)
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
		cursosDisponibles.forEach(cur => {
			if (cur.estado == 'Disponible') {
				texto = texto +
					'<tr>' +
					'<td>' + cur.idcurso + '</td>' +
					'<td>' + cur.nombre + '</td>' +
					'<td>' + cur.modalidad + '</td>' +
					'<td>' + cur.valor + '</td>' +
					'<td>' + cur.descripcion + '</td>' +
					'<td>' + cur.intensidad + '</td>' +
					'<td>' + cur.estado + '</td></tr>'
			}
		})
		texto = texto + '</tbody></table>';
		return texto;
	} catch (error) {
		console.log("catch, Error: " + error);
		return "Error";
	}
}

const VerInscritos = (listaInscritos, idCurso) => {
	try {
		if(listaInscritos.length>0){
		let contador = 0;
		console.log("Entro a VerInscritos");
		console.log("valor de listaInscritos: "+listaInscritos)
		//listarMatriculas();
		//let existe = listaCursos.find(nom => nom.estado == 'Disponible')
		//existe.forEach(cur => {
		console.log('valor de id: ' + idCurso);
		let texto = '<table class="table table-striped table-bordered"> \
		<thead> \
		<th> Id Curso </th> \
		<th> Nombre Curso </th> \
		<th> Cedula Aspirante</th> \
		<th> Nombre Aspirante </th> \
		</thead> \
		<tbody>';
		listaInscritos.forEach(cur => {
			console.log('valor de cur.id: ' + cur.idCurso + ' y idCurso: ' + idCurso)
			if (cur.idCurso == idCurso) {
				contador = contador + 1;
				texto = texto +
					'<tr>' +
					'<td>' + cur.idCurso + '</td>' +
					'<td>' + cur.nombreCurso + '</td>' +
					'<td>' + cur.cedula + '</td>' +
					'<td>' + cur.nombre + '</td></tr>'
			}
		})//<h4>   Bienvenidos a la pagina de mostrar cursos disponibles e inscritos</h4>
		if(contador==0){texto = '<h3><p><b>No hay aspirantes en este curso</b></p></h3'}else{
		texto = texto + '</tbody></table>';}
		return texto;
	}else{return "";}
	} catch (error) {
		console.log("catch, Error: " + error);
		return "Error";
	}
}

const mostrarCursosAspirante = (listar) => {
	try {
		let texto = "";
		listar.forEach(cur => {
			if (cur.estado == 'Disponible') {
				texto = texto +
					'<div class="accordion" id="accordionExample"> \
				<div class="card"> \
						<div class="card-header" id="heading' + cur.idcurso + '">  \
							<h2 class="mb-0"> \
							<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse' + cur.idcurso + '" aria-expanded="false" aria-controls="collapse' + cur.idcurso + '">' +
					'Nombre: ' + cur.nombre + '<br>Valor: ' + cur.valor + '<br>Descripción: ' + cur.descripcion +
					'</button> \
							</h2> \
						</div> \
						<div id="collapse' + cur.idcurso + '" class="collapse" aria-labelledby="heading' + cur.idcurso + '" data-parent="#accordionExample"> \
							<div class="card-body">' +
					'Id curso: ' + cur.idcurso + '<br>Descripción :' + cur.descripcion + '<br>Modalidad: ' + cur.modalidad + '<br>Intensidad horaria: ' + cur.intensidad +
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

const mostrarUsuarios = (listado) => {
	try {
		console.log("Entro a mostrarUsuarios viejo");
		//listar();
		console.log("Paso listar");
		//Usuario.find({}).exec((err,respuesta)=> {
		//	if(err){
		//		return console.log(err)
		//	}
		//	listaUsuariosMongo=respuesta
		//})
		let texto = "<table class='table table-striped table-bordered'> \
					<thead> \
					<th> Cedula </th> \
					<th> Nombre </th> \
					<th> Correo </th> \
					<th> Telefono </th> \
					<th> Rol </th> \
					</thead> \
					<tbody>";
		listado.forEach(user => {
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

const mensajeVerInscritosEliminar = (idCurso, cedula) => {
	let mensajeRetorno = '';
	listarFinal = [];
	listarMatriculas();
	let existe = listarMatricula.find(nom => nom.id == idCurso && nom.cedula == cedula);
	if (existe) {
		var index = listarMatricula.indexOf(existe);
		console.log('valor de index: ' + index);
		if (index > -1) {
			listarMatricula.splice(index, 1);
		}
		mensajeRetorno = guardarMatricula();
		mensajeRetorno = 'Eliminado exitosamente!!';

	} else {
		mensajeRetorno = 'No hay registros con el id y cedula ingresados para eliminar';
	}
	console.log('antes del retorno en mensajeVerInscritosEliminar: ' + mensajeRetorno);
	return mensajeRetorno;

}

const listarMatriculas = () => {
	try {
		listarMatricula = require('../ListaInscritos.json');
	} catch (error) {
		listarMatricula = [];
	}
}

const matricularUsuario = (id) => {
	let mensajeRetorno = '';
	listarMatriculas()
	listar();
	listarOtro();
	let respuestaNew = "";
	let resultado = "";
	let crear = {
		id: id,
		cedula: ""
	};

	if (isNaN(crear.id) | crear.id == null | crear.id == 'undefined' | cedulaGlobal == null | cedulaGlobal == 'undefined' | isNaN(cedulaGlobal) | cedulaGlobal == "") {
		console.log('NO ENTRO A MATRICULAR');
	} else {
		console.log('Entro a matricular cedulaGlobal: ' + cedulaGlobal);
		let cursoExiste = listaCursos.find(aux => aux.id == crear.id);

		let documentoExiste = listaUsuarios.find(aux => aux.cedula == cedulaGlobal);
		console.log("Resultado cedula existe:" + documentoExiste + " Resultado curso existe: " + cursoExiste);
		let duplicadoMatricula = listarMatricula.find(nom => nom.cedula == cedulaGlobal && nom.id == crear.id);
		if (cursoExiste && documentoExiste) { //Valido si el curso existe
			if (!duplicadoMatricula) {
				if (cursoExiste.estado == 'Cerrado') {
					resultado = 'Matricula no exitosa: Curso Cerrado.';
				} else {
					crear.cedula = cedulaGlobal;
					listarMatricula.push(crear);
					console.log("ENTRO A MATRICULAR USUARIO");
					respuestaNew = guardarMatricula();
					resultado = "Matricula exitosa ";
					console.log('valor de resultado: ' + resultado + " y respuestaNew: " + respuestaNew);
				}
			} else {
				resultado = "El usuario ya está inscrito en el curso";
				console.log("El usuario ya está inscrito en el curso");
			}
		} else {
			resultado = "El curso ingresado no existe";
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

const editarCurso = (idCurso, estadoNew) => {
	try {
		listarOtro();
		let mensajeRetorno = '';
		let existe = listaCursos.find(nom => nom.id == idCurso)
		if (existe) {
			if (estadoNew != null && estadoNew != "" && estadoNew != "-") {
				let estado = "estado";
				console.log('valores de existe, estado ' + existe.estado);
				existe[estado] = estadoNew;
			}
			mensajeRetorno = guardarCurso();
			mensajeRetorno = 'Resultado editar: ' + mensajeRetorno;
		} else {
			if (isNaN(idCurso)) {
				mensajeRetorno = '';
			} else {
				console.log('No hay curso con ese id');
				mensajeRetorno = 'Resultado editar: Cambio no exitoso, no hay curso con ese id';
			}
		}
		return mensajeRetorno;
	} catch{
		mensajeRetorno = 'Error, favor consulta con un admin';
		return mensajeRetorno;
	}
}

const mostrarMisCursos = (listadoMisCursos) => {	
	try {
			let texto = "<table class='table table-striped table-bordered'> \
						<thead> \
						<th> Id </th> \
						<th> Nombre Curso </th> \
						</thead> \
						<tbody>";
				listadoMisCursos.forEach(curso => {
					texto = texto +
						'<tr>' +
						'<td>' + curso.idCurso + '</td>' +
						'<td>' + curso.nombreCurso + '</td>'				
			})
			texto = texto + '</tbody></table>';			
				return texto;
			
	} catch (error) {
		console.log(error);
		return "Error";
	}
}

const guardarDocumentoGlobal = (doc) => {
	console.log("ANTES DE ASIGNAR DOCUMENTO: " + cedulaGlobal);
	cedulaGlobal = doc;
	console.log("DESPUES DE ASIGNAR DOCUMENTO: " + cedulaGlobal);
}
const borrarDocumentoGlobal = () => {
	console.log("ENTRO A BORRAR CEDULA GLOBAL: " + cedulaGlobal);
	cedulaGlobal = ""
	console.log("DESPUES A BORRAR CEDULA GLOBAL: " + cedulaGlobal);
}

const EliminarInscripcionAspirante = (idCurso) => {
	let mensajeRetorno = '';
	listarFinal = [];
	listarMatriculas();
	let crear = {
		idCurso: idCurso
	}
	let existe = listarMatricula.find(nom => nom.id == crear.idCurso && nom.cedula == cedulaGlobal);
	if (existe) {
		var index = listarMatricula.indexOf(existe);
		console.log('valor de index: ' + index);
		if (index > -1) {
			listarMatricula.splice(index, 1);
		}
		mensajeRetorno = guardarMatricula();
		mensajeRetorno = 'Eliminado exitosamente!!';

	} else {
		mensajeRetorno = 'No hay registros con el id y cedula ingresados para eliminar';
	}
	console.log('antes del retorno en mensajeVerInscritosEliminar: ' + mensajeRetorno);
	return mensajeRetorno;

}


const mostrarDocentes = (listar, id) => {
	try {
		let texto = `<table class='table table-striped table-hover'> 
					<thead class='thead-dark'> 
					<th> Id </th> 
					<th> Nombre </th> 
					<th> Documento </th> 
					<th> Correo </th>
					<th> Telefono </th>
					<th></th> 
					</thead> 
					<tbody>`;
			listar.forEach(aux => {
			texto = texto +
				`<tr>
				<td> ${id} </td>
				<td name="nombre" value="${aux.nombre}"> ${aux.nombre} </td>
				<td> ${aux.cedula} </td>
				<td> ${aux.correo} </td>
				<td> ${aux.telefono} </td>
				</tr>`
		})
		texto = texto + '</tbody></table>';
		return texto;
	} catch (error) {
		console.log("catch");
		return "Error";
	}
}

const cursosDocente = (listado) => {
	try {	
			let texto = "<table class='table table-striped table-bordered'> \
						<thead> \
						<th> Id </th> \
						<th> Nombre Curso </th> \
						<th> Modalidad </th> \
						<th> Valor </th> \
						<th> Descripción </th> \
						<th> Intensidad horaria </th> \
						</thead> \
						<tbody>";
				listado.forEach(curso => {
					texto = texto +
						'<tr>' +
						'<td>' + curso.idcurso + '</td>' +
						'<td>' + curso.nombre + '</td>' +
						'<td>' + curso.modalidad + '</td>' +
						'<td>' + curso.valor + '</td>' +
						'<td>' + curso.descripcion + '</td>' +
						'<td>' + curso.intensidad + '</td>'
				
			})			
			texto = texto + '</tbody></table>';		
			return texto;
	} catch (error) {
		console.log(error);
		return "Error";
	}
}


const mostrarInscritosDocente = (listado) => {
	try {			
		console.log(listado);	
		if(listado.length == 0)	{
			return "";
		}else{
			let texto = "<table class='table table-striped table-bordered'> \
						<thead> \
						<th> Id </th> \
						<th> Nombre </th> \
						<th> Cedula </th> \
						<th> Telefono </th> \
						<th> Correo </th> \
						</thead> \
						<tbody>";
				listado.forEach(curso => {
					texto = texto +
						'<tr>' +
						'<td>' + curso.idCurso + '</td>' +
						'<td>' + curso.nombre + '</td>' +
						'<td>' + curso.cedula + '</td>' +
						'<td>' + curso.telefono + '</td>' +
						'<td>' + curso.correo + '</td>'
				
			})			
			texto = texto + '</tbody></table>';		
			return texto;
		}
	} catch (error) {
		console.log(error);
		return "Error";
	}
}


module.exports = {
	registrarUsuario,
	intentoRegistro,
	intentoRegistroMongo,
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
	mostrarMisCursos,
	VerInscritos,
	mensajeVerInscritosEliminar,
	guardarDocumentoGlobal,
	borrarDocumentoGlobal,
	EliminarInscripcionAspirante,
	mostrarDocentes,
	cursosDocente, 
	mostrarInscritosDocente
}