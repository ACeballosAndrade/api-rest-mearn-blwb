import {Schema, model} from "mongoose"; //Schema -> instancia el esquema, model -> crea el modelo

const userSchema = new Schema({
    email: {
        type: string,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        index: {unique: true},
    },
    password: {
        type: string,
        required: true,

    }
})

export const User = model('user', userSchema);