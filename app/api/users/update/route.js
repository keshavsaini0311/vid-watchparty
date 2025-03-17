import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/usermodel";
import jwt from "jsonwebtoken";

export async function PUT(request) {
  try {
    // Connect to the database
    await connectDB();

    // Get the token from cookies
    const token = request.cookies.get("token")?.value;
    
    if (!token) {
      return NextResponse.json({
        error: "Unauthorized: No token provided",
        success: false
      }, { status: 401 });
    }

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.token_secret);
    const userId = decodedToken.id;

    // Get the updated profile data from request body
    const body = await request.json();
    const { username, email } = body;
    // Validate input
    if (!username || !email) {
      return NextResponse.json({
        error: "Username and email are required",
        success: false
      }, { status: 400 });
    }

    // Check if email is already in use by another user
    const existingUser = await User.findOne({ 
      email, 
      _id: { $ne: userId } 
    });

    if (existingUser) {
      return NextResponse.json({
        error: "Email is already in use",
        success: false
      }, { status: 409 });
    }

    // Update the user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({
        error: "User not found",
        success: false
      }, { status: 404 });
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
      success: true
    });
    
  } catch (error) {
    console.error("Profile update error:", error);
    
    if (error.name === "JsonWebTokenError") {
      return NextResponse.json({
        error: "Invalid token",
        success: false
      }, { status: 401 });
    }
    
    if (error.name === "TokenExpiredError") {
      return NextResponse.json({
        error: "Token expired",
        success: false
      }, { status: 401 });
    }
    
    return NextResponse.json({
      error: "An error occurred while updating profile",
      success: false
    }, { status: 500 });
  }
}
