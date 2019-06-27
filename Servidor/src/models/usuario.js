const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usuarioSchema = Schema({
	nombre: {
		type: String,
		require :  true
	},
	cedula: {
		type: Number,
		require: true
	},
	correo: {
		type: String,
		require: true
	},
	telefono: {
		type: Number,
		require: true
	},
	rol: {
		type: String,
		require: true
	}

});

const Usuario = mongoose.model('Usuario',usuarioSchema);

module.exports = Usuario 