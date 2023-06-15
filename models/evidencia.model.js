import { Schema, model } from "mongoose";

const evidenciaSchema = new Schema({
    nombre: {type: String, required: true},
    enlace: {type: String},
    actividadEspecifica: {type: Schema.Types.ObjectId, ref:'actividadEspecifica'},
    orden: {type: Number, required: true}
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
})

const evidenciaModel = model('evidencia', evidenciaSchema);
export default evidenciaModel