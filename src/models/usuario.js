const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

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
	},
	nombreUser: {
		type: String,
		require :  true,
		trim : true
	},
	password: {
		type: String,
		require :  true
	},
	avatar : {
		type: Buffer
	}
});
usuarioSchema.plugin(uniqueValidator);
const Usuario = mongoose.model('Usuario',usuarioSchema);

module.exports = Usuario 