
import { userModel } from './../../../DB/models/user.model.js';
import { messageModel } from './../../../DB/models/message.model.js';

export const sendMessage = async (req, res) => {
    try {
        const { reciverId } = req.params
        const { text } = req.body

        const user = await userModel.findById(reciverId).select("firstName lastName")
        if (user) {
            const newMessage = new messageModel({ text, reciverId })
            const savedMessage = newMessage.save()
            res.json({ message: "done", savedMessage })
        } else {
            res.json({ message: "invalid user" })
        }
    } catch (error) {
        res.json({ message: "catch error", error })
    }
}

export const softDelete = async (req, res) => {
    const { id } = req.params
    const deletedMsg = await messageModel.updateOne({ _id: id, reciverId: req.user._id, deleted: false }, { deleted: true })
    deletedMsg.modifiedCount ? res.json({ message: "done" }) : res.json({ message: "msg not found" })
}