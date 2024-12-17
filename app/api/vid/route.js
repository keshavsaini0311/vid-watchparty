import User from "@/models/usermodel";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";

connectDB();

export async function POST(req) {
    try {
        const { vidurl,id } = await req.json();

        if (!vidurl || !id) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        user.vidurl = vidurl;
        await user.save();

        return NextResponse.json({ message: "Video uploaded successfully", success: true }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}