"use client"
import { CldVideoPlayer } from 'next-cloudinary';
import 'next-cloudinary/dist/cld-video-player.css';
import { upload } from '@/lib/upload';
import { useRouter } from 'next/navigation';
import { useActionState, useState, useEffect } from 'react';

function page() {

  const router = useRouter();

  const [url, formAction] = useActionState(upload, null);
  const [id, setId] = useState('');

  useEffect(() => {
    if (url) {
      router.push(`/room/${id}`);
    }
  }, [url]);

  useEffect(() => {
    const getuserid = async () => {
      const response = await fetch('/api/me');
      const data = await response.json();
      setId(data._id);
    }
    getuserid();
  }, []);

  console.log(url);
  
    
return(
    <div className='min-h-screen flex-col items-center justify-between p-10 mt-20'>
     
    <div className="">
      <h1 className='text-xl font-bold text-center pb-10'>How to upload a video to Cloudinary in Next.js App Router</h1>
      <div className="flex justify-center my-10 items-center">
        <form action={formAction}>
          <input type="text" name="id" id="id" className='hidden' defaultValue={id} />
          <input type="file" name='video' accept="video/*" />
          <button className='bg-blue-800 text-white p-2 rounded-md'>Upload</button>
        </form>
      </div>
    </div>
    
    </div>
  )
}

export default page