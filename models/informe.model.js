import { Schema, model } from "mongoose";

const informeSchema = new Schema({
    docente: { type: Schema.Types.ObjectId, ref: 'docente' },
    formato: { type: Schema.Types.ObjectId, ref: 'formato' },
    documento_firma_docente: { type: String, default: null },
    documento_firma_director: { type: String, default: null },
    estado: {
        type: String,
        enum: ['iniciado', 'completado', 'enviadoFirmar', 'novedadDocumento'],
        default: 'noIniciado'
    },
    novedadDocumento: {

    },
    periodoAcademico: { type: Schema.Types.ObjectId, ref: 'periodoAcademico' },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
})

const informeModel = model('informeFinal', informeSchema);
export default informeModel