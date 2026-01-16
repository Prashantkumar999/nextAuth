import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "pleaes provide a username!"],
        trim: true,
        unique: [true, "username should be unique"]
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "pleaes provide a password"],
        trim: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
})

const User = mongoose.models.users || mongoose.model("users",userSchema)

export default User