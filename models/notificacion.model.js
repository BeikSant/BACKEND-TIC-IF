import { Schema, model } from "mongoose";

const notificacionSchema = new Schema({
    mensaje: {type: String, required: true},
    leido: {type: Boolean, default: false },
    origen: {type: Schema.Types.ObjectId, ref:'docente'},
    destino: {type: Schema.Types.ObjectId, ref:'docente'}
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
})

const notificacionModel = model("notificacion", notificacionSchema)
export default notificacionModel