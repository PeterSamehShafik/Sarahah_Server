import bcrypt from "bcryptjs"
import { userModel } from './../../../DB/models/user.model.js';
import { myEmail } from './../../../services/email.js';
import jwt from "jsonwebtoken"
import { nanoid } from "nanoid";

export const signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body
        const exist = await userModel.findOne({ email })
        if (!exist) {
            const hashedPassword = await bcrypt.hash(password, parseInt(process.env.saltRounds))
            const newUser = new userModel({ firstName, lastName, email, password: hashedPassword })
            const savedUser = await newUser.save()
            const { _id, createdAt, age, phone } = savedUser

            const user = { _id, firstName, lastName, email, age, phone, createdAt }

            const token = jwt.sign({ user }, process.env.confirmEmailMSGTokenSign, { expiresIn: 60 * 60 })
            const link = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}`
            myEmail(email, "Confirmation email", `<a href=${link}>Click Me</a>`)

            savedUser ? res.json({ message: "done", details: "please check your email", user }) : res.json({ message: "Please try again" })
        } else {
            res.json({ message: "Email already exist" })
        }
    } catch (error) {
        res.json({ message: "catch error", error })

    }
}

export const confirmEmail = async (req, res) => {
    try {
        const { token } = req.params
        if (token) {
            const decoded = jwt.verify(token, process.env.confirmEmailMSGTokenSign)
            if (decoded?.user) {
                const userConfirm = await userModel.updateOne({ _id: decoded.user._id, confirmEmail: false }, { confirmEmail: true })
                userConfirm.modifiedCount ? res.json({ message: "done" }) : res.json({ message: "failed to confirm or alraedy registered" })
            } else {
                res.json({ message: "in-valid token payload" })
            }
        } else {
            res.json({ message: "in-valid token" })
        }
    } catch (error) {
        res.json({ message: "catch error", error })
    }
}

export const signin = async (req, res) => {
    const { email, password } = req.body
    const signedUser = await userModel.findOne({ email, deleted: false })

    if (signedUser) {
        const passwordMatch = await bcrypt.compare(password, signedUser.password)
        if (passwordMatch) {
            if (signedUser.confirmEmail) {
                const { _id, firstName, lastName, createdAt, updatedAt, age, phone } = signedUser
                const user = { _id, email, firstName, lastName, createdAt, updatedAt, age, phone }
                const token = jwt.sign({ user }, process.env.signedUserTokenSign, { expiresIn: '12h' })
                const online = await userModel.updateOne({ _id }, { isOnline: true })
                online.modifiedCount ? res.json({ message: "done", token }) : res.json({ message: "somth went wrong" })
            } else {
                res.json({ message: "Please confirm your email" })
            }

        } else {
            res.json({ message: "invalid password" })
        }


    } else {
        res.json({ message: "invalid email" })
    }
}

export const sendCode = async (req, res) => {
    try {
        const { email } = req.body
        const user = await userModel.findOne({ email }).select('email')
        if (user) {
            const code = nanoid()
            myEmail(email, "Reset password", `<h3>your code is: <b>${code}</b> </h3>`)
            const setCode = await userModel.updateOne({ email }, { code })
            setCode.modifiedCount ? res.json({ message: 'done' }) : res.json({ message: 'failed to send code' })
        } else {
            res.json({ message: "email not found" })
        }
    } catch (error) {
        res.json({ message: "catch error ", error })
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email, newPassword, code } = req.body
        if (code == null) {
            res.json({ message: "code can't be null Mr.Hacker :)" })
        } else {
            const hashPassword = await bcrypt.hash(newPassword, parseInt(process.env.saltRounds))
            const updateUser = await userModel.updateOne({ email, code }, { password: hashPassword, code: null })
            updateUser.modifiedCount ? res.json({ message: 'done' }) : res.json({ message: 'invalid code' })
        }
    } catch (error) {
        res.json({ message: "catch error ", error })
    }
}