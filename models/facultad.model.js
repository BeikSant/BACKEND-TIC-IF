import { Schema, model } from "mongoose";

const facultadSchema = new Schema({
    nombre: { type: String, required: true },
    siglas: { type: String, uppercase: true, required: true },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
})

const facultadModel = model('facultad', facultadSchema);
export default facultadModel