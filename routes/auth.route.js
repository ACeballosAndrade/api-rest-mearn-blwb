import express from "express";
import { login, register } from "../controllers/auth.controller.js";
import { body } from "express-validator";
import { validationResultExpress } from "../middlewares/validationResultExpress.js";
const router = express.Router()

router.post('/register',[
    body('email', "Formato de email incorrecto").trim().isEmail().normalizeEmail(),
    body("password", "Formato de Password Incorrecta").trim().isLength({min: 6})
], validationResultExpress, register);
router.post('/login',[
    body('email', "Formato de email incorrecto").trim().isEmail().normalizeEmail(),
    body("password", "Formato de Password Incorrecta").trim().isLength({min: 6})
], validationResultExpress, login);

export default router;