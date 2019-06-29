const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
const incritoSchema = Schema({
	idCurso: {
		type: Number,
		require: true
	},
	nombreCurso: {
		type: String,
		require :  true
	},
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
	}
});
incritoSchema.plugin(uniqueValidator);
const Inscrito = mongoose.model('Inscrito',incritoSchema);

module.exports = Inscrito 