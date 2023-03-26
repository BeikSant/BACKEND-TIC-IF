import { Schema, model } from "mongoose";

const docenteSchema = new Schema({
    primerNombre: { type: String, required: true},
    segundoNombre: { type: String, default: ''},
    primerApellido: { type: String, required: true},
    segundoApellido: { type: String, required: true},
    cedula: { type: String, required: true, unique: true},
    correo: { type: String, required: true, unique: true},
    dedicacion: { type: String, required: true},
    carrera: {type: Schema.Types.ObjectId, ref: 'carrera'},
    usuario: {type: Schema.Types.ObjectId, ref: 'usuario', default: null}
}, {

    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
})

const docenteModel = model('docente', docenteSchema)
export default docenteModel
