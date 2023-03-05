import { Schema, model } from "mongoose";

const actividadDesarrolladaSchema = new Schema({
    nombre: {type: String, required: true},
    actividadEspecifica: {type: Schema.Types.ObjectId, ref:'actividadEspecifica'},
    orden: {type: Number, required: true}
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
})

const actividadDesarrolladaModel = model('actividadDesarrollada', actividadDesarrolladaSchema);
export default actividadDesarrolladaModel