import { Schema, model } from "mongoose";

const funcionSustantivaSchema = new Schema({
    nombre: {type: String, required: true},
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
})

const funcionSustantivaModel = model('funcionSustantiva', funcionSustantivaSchema);
export default funcionSustantivaModel