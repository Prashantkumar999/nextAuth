import connect from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export default async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { token } = reqBody;

        //find user with token 
        const user = await User.findOne({ verifyToken: token, verifyTokenExpiry: { $gt: Date.now() } })

        //id user does not exists
        if (!user) {
            return NextResponse.json({
                success: false,
                error: "invalid token",
                status: 400
            })
        }
        console.log(user);
        // clean up ,, set isverified true..remove verifyToken and verifyTokenExpiry
        user.isVerified = true
        user.verifyToken = undefined
        user.verifyTokenExpiry = undefined

        await user.save()

        return NextResponse.json({
            success: true,
            message: "user verified successfully"
        }, {
            status: 200
        })


    } catch (err: any) {
        return NextResponse.json({
            message: err.message,
        }, { status: 500 })
    }
}