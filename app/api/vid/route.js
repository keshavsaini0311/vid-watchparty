import cloudinary from 'cloudinary';
import { NextResponse } from 'next/server';
// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  
    try {
      const { file } = req.body;

      const uploadResponse = await cloudinary.v2.uploader.upload(file, {
        resource_type: 'video',
        folder: 'videos', 
      });

      const res= NextResponse.status(200).json({ url: uploadResponse.secure_url });

      return res;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      return NextResponse.status(500).json({ error: 'Cloudinary upload failed' });
    }
  }

