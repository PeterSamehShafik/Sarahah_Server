import mongoose from "mongoose";

const connectDB = async () => {
    return await mongoose.connect(process.env.DBURI)
        .then(res => {
            console.log('DATABASE Connected succesfully......')
            // console.log(res)
        })
        .catch(err => console.log(`DATABASE couldn't connect...`, err))
}

export default connectDB