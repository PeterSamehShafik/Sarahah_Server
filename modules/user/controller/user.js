
import { userModel } from './../../../DB/models/user.model.js';
import bcrypt from 'bcryptjs';
import { messageModel } from './../../../DB/models/message.model.js';

export const signout = async (req, res) => {
    try {
        const lastSeen = new Date()
        const user = await userModel.updateOne({ _id: req.user._id, isOnline: true }, { lastSeen, isOnline: false })
        user.modifiedCount ? res.json({ message: "done" }) : res.json({ message: "failed to signout" })
    } catch (error) {
        res.json({ message: "catch err", error })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { age, phone } = req.body
        const updateUser = await userModel.updateOne({ _id: req.user._id }, { age, phone })
        updateUser.modifiedCount ? res.json({ message: "done" }) : res.json({ message: "failed to update" })
    } catch (error) {
        res.json({ message: "catch err", error })

    }
}

export const deleteProfile = async (req, res) => {
    try {
        const deleteUser = await userModel.deleteOne({ _id: req.user._id })
        deleteUser.deletedCount ? res.json({ message: "done" }) : res.json({ message: "user not found" })
    } catch (error) {
        res.json({ message: "catch err", error })
    }
}

export const allUsers = async (req, res) => {
    try {
        const allUsers = await userModel.find({ deleted: false }).select("-password -code -confirmEmail -deleted")
        res.json({ message: "done", allUsers })
    } catch (error) {
        res.json({ message: "catch err", error })
    }
}

export const profile = async (req, res) => {
    try {
        const { _id } = req.params
        const user = await userModel.find({ _id, deleted: false }).select("firstName lastName email lastSeen")
        user ? res.json({ message: "done", user }) : res.json({ message: "user not found" })
    } catch (error) {
        res.json({ message: "catch err", error })
    }
}

export const softDelete = async (req, res) => {
    try {
        const deletedUser = await userModel.updateOne({ _id: req.user._id, deleted: false }, { deleted: true, isOnline: false })
        deletedUser.modifiedCount ? res.json({ message: "done" }) : res.json({ message: "user Not found" })
    } catch (error) {
        res.json({ message: "catch err", error })
    }
}

export const updatePassword = async (req, res) => {
    try {
        const { newPassword, oldPassword } = req.body
        const user = await userModel.findById(req.user._id)
        const passwordMatch = await bcrypt.compare(oldPassword, user.password)
        if (passwordMatch) {
            const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.saltRounds))
            const updatedUser = await userModel.updateOne({ _id: user._id }, { password: hashedPassword })
            updatedUser.modifiedCount ? res.json({ message: 'done' }) : res.json({ message: 'failed to update' })
        } else {
            res.json({ message: 'Wrong Password' })
        }
    } catch (error) {
        res.json({ message: "catch err", error })
    }
}

export const userMessages = async (req, res) => {
    const allMessages = await messageModel.find({ reciverId: req.user._id, deleted: false })
    res.json({ message: "done", allMessages })
}