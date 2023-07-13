import { Router } from "express";
import * as authController from './controller/register.js';

const router = Router()

router.post("/signup", authController.signup)
router.post("/signin", authController.signin)
router.get("/confirmEmail/:token", authController.confirmEmail)
router.patch("/sendCode", authController.sendCode)
router.patch("/forgotPassword", authController.forgotPassword)

export default router