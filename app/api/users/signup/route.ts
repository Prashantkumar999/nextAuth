import connect from '@/dbConfig/dbConfig'
import User from '@/models/userModel'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { sendMail } from '@/utils/mailer'

connect()

export async function POST(request: NextRequest) {
    try {
        const { username, email, password } = await request.json()

        // basic validation (until Zod is added)
        if (!username || !email || !password) {
            return NextResponse.json(
                { success: false, error: 'All fields are required' },
                { status: 400 }
            )
        }

        // check if user already exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return NextResponse.json(
                { success: false, error: 'User already exists' },
                { status: 409 } // Conflict is better here
            )
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // create user
        const createdUser = await User.create({
            username,
            email,
            password: hashedPassword
        })

        // send verification email
        await sendMail({
            email,
            emailType: 'VERIFY',
            userId: createdUser._id
        })

        // remove password before sending response
        const userObject = createdUser.toObject()
        delete userObject.password

        return NextResponse.json({
            success: true,
            user: userObject,
            message: 'User created successfully'
        })

    } catch (err: any) {    
        return NextResponse.json(
            { success: false, error: err.message || 'Something went wrong' },
            { status: 500 }
        )
    }
}
