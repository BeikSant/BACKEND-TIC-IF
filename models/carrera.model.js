import { Schema, model } from "mongoose";

const carreraSchema = new Schema({
    nombre: { type: String, required: true },
    siglas: { type: String, required: true },
    facultad: {type: Schema.Types.ObjectId, ref: 'facultad' },
},
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    }
)

const carreraModel = model('carrera', carreraSchema);
export default carreraModel