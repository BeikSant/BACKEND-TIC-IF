import { Schema, model } from "mongoose";

const periodoAcademicoSchema = new Schema({
    nombre: { type: String, required: true },
    fechaInicio: { type: Date, required: true},
    fechaFin: { type: Date},
    estado: { type: Boolean, default: true}
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
})

const periodoAcademicoModel = model('periodoAcademico', periodoAcademicoSchema);
export default periodoAcademicoModel