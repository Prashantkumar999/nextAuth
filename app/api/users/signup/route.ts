import connect from '@/dbConfig/dbConfig'
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs';
import { sendMail } from '@/utils/mailer';

connect()
export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        console.log(reqBody)
        const { username, email, password } = reqBody

        //validation ----use zod


        //check if alrady exists
        const user = await User.findOne({ email });
        if (user) {
            return NextResponse.json({
                status: 400,
                success: false,
                error: "user already exists"
            })
        }
        //if not first hash the password then create the db entry 
        const hashedPassword = await bcrypt.hash(password, 10)

        const createdUser = await User.create({
            username, email, password: hashedPassword
        })
        console.log("user", createdUser)
        // user is created now its time to send an email

        await sendMail({ email, emailType: "VERIFY", userId: createdUser._id })
        //return successful response 
        return NextResponse.json({
            success: true,
            user: createdUser,
            message: "user created successfully"
        })
      

    } catch (err: any) {
        return NextResponse.json({
            error: err.message || "something went wrong"
        }, {
            status: 500
        })
    }
}