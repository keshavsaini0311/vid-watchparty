
// src/actions/upload.ts
"use server"
import { v2 as cloudinary } from 'cloudinary';



cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export async function upload(previousState, formData) {
  
  const id=formData.get('id');
  const file = formData.get('video') ;

  console.log(formData.get('id'));
  
  const buffer = Buffer.from(await file.arrayBuffer());
  try {
    const base64Image = `data:${file.type};base64,${buffer.toString(
      'base64'
    )}`;
    console.log(`The file: ${previousState} is uploading...`);
    const response = await cloudinary.uploader.upload(base64Image, {
      resource_type: 'video',
      public_id: `vid-watchparty-${id}`,
    });
    previousState = response.secure_url;
    return previousState
  } catch (error) {
    console.error(error);
  }
}