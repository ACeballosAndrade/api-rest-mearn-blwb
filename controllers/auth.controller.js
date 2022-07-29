import {User} from '../models/User.js';
import jwt from 'jsonwebtoken';
import { generateRefreshToken, generateToken } from '../utils/tokenManager.js';

export const register = async(req, res) => {
    const {email, password} = req.body
    try {
        //Alternativa buscadopor email
        let user = await User.findOne({email});
        if (user) throw {code: 11000};

        user = new User({email, password});
        await user.save();

        //jwt token

        return res.status(201).json({ok: true})
    } catch (error) {
        console.log(error)
        // ALternativa por defecto mongoose
        if(error.code === 11000){
            return res.status(400).json({error: "Ya existe este usuario"})
        }
        return res.status(500).json({error: "Algo falló en el servidor"})
    }
}

export const login = async(req, res) => {
    try {
        const {email, password} = req.body
        
        let user = await User.findOne({email});
        if(!user) return res.status(403).json({error: "No existe este usuario"});

        const respuestaPassword = user.comparePassword(password)
        if(!respuestaPassword)
            return res.status(403).json({error: "Contraseña incorrecta"});

        //Generar Token JWT
        const {token, expiresIn} = generateToken(user.id)
        generateRefreshToken(user.id, res)

        return res.json({token, expiresIn});

    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Algo falló en el servidor"})
    }
};

export const infoUser = async(req, res) => {

    try {
        const user = await User.findById(req.uid).lean()
        return res.json({email: user.email, uid: user.id})
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "error de server"})
    }


};

export const refreshToken = (req, res) => {

    console.log("Este es el req ...."+req)
    try {
    const refreshTokenCookie = req.cookies.refreshToken;
       if(!refreshTokenCookie) throw new Error("No existe el refreshTokenCookie");

       const {uid} = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH);
       console.log("este es el uid "+ uid);
       const {token, expiresIn} = generateToken(uid)

       return res.json({token, expiresIn});

    } catch (error) {
        console.log("Error en auth.controller ......"+error)
        const TokenVerificationErrors = {
            "invalid signature": "La firma del JWT no es válida",
            "jwt expired": "JWT expirado",
            "invalid token": "Token inválido",
            "No Bearer": "Utiliza el formato Bearer",
            "jwt malformed": "JWT formato no válido"
        }
    
        return res.status(401).send({error: TokenVerificationErrors[error.message]})
    }

};

export const logout = (req, res) => {
    res.clearCookie('refreshToken')
    res.json({ok: true});
};
