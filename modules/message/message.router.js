import { Router } from "express";
import * as mc from './controller/message.js';
import { auth } from './../../middlewares/auth.js';

const router = Router()

router.post("/sendMessage/:reciverId", mc.sendMessage)
router.patch("/softDelete/:id", mc.softDelete)

export default router