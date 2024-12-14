import bcryptjs from "bcryptjs";
import mongoose from "mongoose";
import User from "@/models/usermodel";
import connectDB from "@/lib/db";
import { NextResponse } from "next/server";

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
        return NextResponse.json({ message: "Login successful", success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}