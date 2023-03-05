import { Schema, model } from "mongoose";

const actividadDistributivoSchema = new Schema({
    sigla: {type: String, required: true},
    //nombre: {type: String, required: true},
    descripcion: {type: String, required: true},
    estado: {type: Boolean, default: true},
    funcionSustantiva: {type: Schema.Types.ObjectId, ref:'funcionSustantiva'},
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
})

const actividadDistributivoModel = model('actividadDistributivo', actividadDistributivoSchema);
export default actividadDistributivoModel