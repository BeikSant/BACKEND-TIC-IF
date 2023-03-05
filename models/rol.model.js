import { Schema, model } from "mongoose";

const rolSchema = new Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
})

const rolModel = model('rol', rolSchema);
export default rolModel