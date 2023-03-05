import { Schema, model } from "mongoose";

const docenteSchema = new Schema({
    primerNombre: { type: String, required: true},
    segundoNombre: { type: String, required: true},
    primerApellido: { type: String, required: true},
    segundoApellido: { type: String, required: true},
    cedula: { type: String, required: true},
    correo: { type: String, required: true},
    dedicacion: { type: String, required: true},
    carrera: {type: Schema.Types.ObjectId, ref: 'carrera'}
}, {

    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
})

const docenteModel = model('docente', docenteSchema)
export default docenteModel