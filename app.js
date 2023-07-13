import dotenv from "dotenv"
dotenv.config()

import express from "express"
import connectDB from './DB/connection.js';
import * as indexRouter from "./modules/index.router.js"

const app = express()
const PORT = 3000
const baseURL = process.env.BASEURL


app.use(express.json())

app.use(`${baseURL}/auth`, indexRouter.authRouter)
app.use(`${baseURL}/user`, indexRouter.userRouter)
app.use(`${baseURL}/message`, indexRouter.messageRouter)




app.use('*', (req, res) => {
    res.json({ message: "404 not found", details: "In-valid URL or method" })
})


connectDB()
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.........`)
})