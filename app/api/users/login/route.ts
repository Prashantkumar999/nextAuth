import connect from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";

connect()

export default async function POST(request: NextRequest) {
    //get data from the user, email and pass
    const reqBody = await request.json();
    const { email, password } = reqBody;
    //verification
    if (!email || !password) {
        return NextResponse.json({
            success: false,
            message: "both the email and password are required",
            status: 400,
        })
    }
    //
}