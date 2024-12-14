import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";
import User from "@/models/usermodel";
import connectDB from "@/lib/db";

connectDB();

export async function POST(request) {
    try {
        const {username, email, password } = await request.json();
        const hashedPassword = await bcryptjs.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        return NextResponse.json({ message: "User created successfully", success: true }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}