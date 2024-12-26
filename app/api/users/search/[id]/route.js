import { NextRequest,NextResponse } from "next/server";
import User from "@/models/usermodel";
import connectDB from "@/lib/db";

connectDB();

export async function GET(request,{params}) {
    try {
        const { id } =await params;
        const user = await User.findById(id).select("-password");
        if(!user)return NextResponse.json({ error: "User not found", success: false }, { status: 404 });
        return NextResponse.json({user:user,success:true}, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}