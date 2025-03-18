import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/usermodel";
import jwt from "jsonwebtoken";
import { app } from "@/lib/firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';

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

    // Get the form data
    const formData = await request.formData();
    const file = formData.get('avatar');

    if (!file) {
      return NextResponse.json({
        error: "No file uploaded",
        success: false
      }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({
        error: "Invalid file type. Please upload an image",
        success: false
      }, { status: 400 });
    }

    try {
      // Initialize Firebase Storage with the existing app
      const storage = getStorage(app);
      
      // Convert file to buffer
      const buffer = Buffer.from(await file.arrayBuffer());
      
      // Generate unique filename with original extension
      const ext = file.type.split('/')[1];
      const filename = `avatars/${userId}/${uuidv4()}.${ext}`;
      
      // Create a reference to the file in Firebase Storage
      const storageRef = ref(storage, filename);
      
      // Upload the file
      await uploadBytes(storageRef, buffer, {
        contentType: file.type
      });
      
      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);

      // Update user's avatar in database
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { avatar: downloadURL },
        { new: true }
      ).select("-password");

      if (!updatedUser) {
        return NextResponse.json({
          error: "User not found",
          success: false
        }, { status: 404 });
      }

      return NextResponse.json({
        message: "Avatar updated successfully",
        avatar: downloadURL,
        success: true
      });

    } catch (error) {
      console.error('Error uploading to Firebase:', error);
      return NextResponse.json({
        error: "Error uploading file",
        success: false
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error("Avatar update error:", error);
    
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
      error: "An error occurred while updating avatar",
      success: false
    }, { status: 500 });
  }
} 