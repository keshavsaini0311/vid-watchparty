"use client"
import { CldVideoPlayer } from 'next-cloudinary';
import 'next-cloudinary/dist/cld-video-player.css';
import { upload } from '@/lib/upload';
import { useActionState } from 'react';
function page() {
  const [url, formAction] = useActionState(upload, null);
  console.log(url);
  
return(
    <div className='min-h-screen flex-col items-center justify-between p-10 mt-20'>
      <h1 className='text-xl font-bold text-center pb-10'>How to upload a video to Cloudinary in Next.js App Router</h1>
      <div className="flex justify-center my-10 items-center">
        <form action={formAction}>
          <input type="file" name='video' accept="video/*" />
          <button className='bg-blue-800 text-white p-2 rounded-md'>Upload</button>
        </form>
      </div>
    {url && 
    <div className="">
        <h1>Preview</h1>
    <CldVideoPlayer width="860" height="470" src={url} />
    </div>}
    </div>
  )
}

export default page