import { getDataFromToken } from "@/lib/getDataFromToken";
import { NextRequest,NextResponse } from "next/server";
import User from "@/models/usermodel";
import connectDB from "@/lib/db";

connectDB();
export async function GET(request) {
    try {
        const id = await getDataFromToken(request);
        const user = await User.findById(id).select("-password"); 
        return NextResponse.json({success: true, user});
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}