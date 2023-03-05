import { Schema, model } from "mongoose";

const observacionSchema = new Schema({
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

const observacionModel = model('observacion', observacionSchema);
export default observacionModel