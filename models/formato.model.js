import { Schema, model } from "mongoose";

const formatoSchema = new Schema({
    nombreFormato: {type: String, required: true},
    facultad: {type: String, required: true},
    carrera: {type: String, required: true},
    docente: {type: String, required: true},
    dedicacion: {type: String, required: true},
    periodoAcademico: {type: String, required: true},
    totalHoras: {type: String, required: true},
    funcionesSustantivas: {type: String, required: true},
    actividadesDistributivo: {type: String, required: true},
    horasPAO: {type: String, required: true},
    actividadesDesarrolladas: {type: String, required: true},
    evidencias: {type: String, required: true},
    observaciones: {type: String, required: true},
    conclusiones: {type: String, required: true},
    estado: {type: Boolean, default: true},
    tipo: {type: String, default:'CREADO POR EL DIRECTOR'},
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
})

const formatoModel = model('formato', formatoSchema);
export default formatoModel