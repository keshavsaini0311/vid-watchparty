import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Check if there's actually a token to clear
    const token = request.cookies.get("token")?.value;
    
    if (!token) {
      return NextResponse.json({
        message: "No active session found",
        success: false
      }, { status: 400 });
    }

    const response = NextResponse.json({
      message: "Logout successful",
      success: true,
    });

    // Clear the token cookie
    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0), // Set expiration to epoch time (effectively deleting it)
      path: "/",
      sameSite: "strict", // Enhance security
      secure: process.env.NODE_ENV === "production", // Only use HTTPS in production
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ 
      error: "An error occurred during logout", 
      success: false 
    }, { status: 500 });
  }
}

