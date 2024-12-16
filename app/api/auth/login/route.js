import bcryptjs from "bcryptjs";
import mongoose from "mongoose";
import User from "@/models/usermodel";
import connectDB from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connectDB();

export async function POST(request) {
    try {
        const { email, password } = await request.json();
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email,
        };
        const token= await jwt.sign(tokenData,process.env.token_secret,{expiresIn:"1d"});
        const response = NextResponse.json({
            message: "User logged in successfully",
            success: true,
            user,
        });
        response.cookies.set("token", token, {
            httpOnly: true,

        })
        return response;
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}