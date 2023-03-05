import { Schema, model } from "mongoose";

const conclusionRecomendacionSchema = new Schema({
    nombre: {type: String, required: true},
    informe: {type: Schema.Types.ObjectId, ref: 'informe'},
    orden: {type: Number, required: true}
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
})

const conclusionRecomendacionModel = model('conclusionRecomendacion', conclusionRecomendacionSchema);
export default conclusionRecomendacionModel