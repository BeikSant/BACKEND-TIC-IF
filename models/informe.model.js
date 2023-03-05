import { Schema, model } from "mongoose";

const informeSchema = new Schema({
    docente: {type: Schema.Types.ObjectId, ref: 'docente'},
    formato: {type: Schema.Types.ObjectId, ref: 'formato'},
    periodoAcademico: {type: Schema.Types.ObjectId, ref:'periodoAcademico'},
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
})

const informeModel = model('informeFinal', informeSchema);
export default informeModel