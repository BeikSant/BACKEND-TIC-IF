import { Schema, model } from "mongoose";
import bcryptsjs from "bcryptjs"

const usuarioSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    estado: { type: Boolean, default: true},
    rol: {type: Schema.Types.ObjectId, ref: 'rol'},
    tokenRecuperacion: {type: String, required: false},
    tokenExpire: {type: Date, required: false},
    docente: {type: Schema.Types.ObjectId, ref: 'docente'}
},
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    }
);

usuarioSchema.pre("save", async function(next){
    if (!this.isModified("password")) return next()
    try {
        const salt = await bcryptsjs.genSalt(10)
        this.password = await bcryptsjs.hash(this.password, salt)
        next()
    } catch (err) {
        console.error(err)
    }
})

usuarioSchema.methods.comparePassword = async function(candidatePassword){
    return await bcryptsjs.compare(candidatePassword, this.password)
}

const usuarioModel = model('usuario', usuarioSchema);
export default usuarioModel
