const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cursoSchema = Schema({
    idcurso: {
		type: Number,
		required: true
	},
    nombre: {
		type: String,
        required :  true,
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
	},
	docente: {
		type: String,
		default: ""
	}
});
const Cursos = mongoose.model('Cursos',cursoSchema);

module.exports = Cursos 