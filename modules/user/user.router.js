import { Router } from "express";
import * as uc from './controller/user.js';
import { auth } from './../../middlewares/auth.js';

const router = Router()

router.get("/all", uc.allUsers)
router.get("/messages", auth(), uc.userMessages)
router.get("/profile/:_id", uc.profile)

router.get("/signout", auth(), uc.signout)

router.patch("/", auth(), uc.updateProfile)
router.patch("/updatePassword", auth(), uc.updatePassword)

router.patch("/softDelete", auth(), uc.softDelete)
router.delete("/", auth(), uc.deleteProfile)

export default router