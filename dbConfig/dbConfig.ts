import mongoose from "mongoose";

export default async function connect() {
    try {
        mongoose.connect(process.env.MONGO_URL!)
        const connection = mongoose.connection
        connection.on("connected", () => {
            console.log("mongodb is connected")
        })
        connection.on("error", (err) => {
            console.log("mongodb connection failed", err)
            process.exit()
        })
    } catch (err) {
        console.log("something went wrong in db connection")
    }
}