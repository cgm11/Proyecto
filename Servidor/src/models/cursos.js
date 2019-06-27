const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

const cursoSchema = Schema({
	nombre: {
		type: String,
        required :  true
	},
	idcurso: {
		type: Number,
		required: true,
        unique: true
	},
	descripcion: {
		type: String,
		required: true
	},
	valor: {
		type: Number,
		required: true
	},
	modalidad: {
        type: String, 
        default: ""
    },
    intensidad: {
        type: Number,
        default: 0
    },
    estado: {
        type: String
    }

});
cursoSchema.plugin(uniqueValidator);
const Cursos = mongoose.model('Cursos',cursoSchema);

module.exports = Cursos 