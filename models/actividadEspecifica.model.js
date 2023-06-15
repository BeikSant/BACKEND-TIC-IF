import { Schema, model } from "mongoose";

const actividadEspecificaSchema = new Schema({
    nombre: {type: String, required: true},
    horas: {type: Number, required: true},
    requerido: {type: Boolean, default: true},
    informeFinal: {type: Schema.Types.ObjectId, ref:'informeFinal'},
    actividadDistributivo: {type: Schema.Types.ObjectId, ref:'actividadDistributivo'},
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
})

const actividadEspecificaModel = model('actividadEspecifica', actividadEspecificaSchema);
export default actividadEspecificaModel