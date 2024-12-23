"use client"
import { useState,useEffect,useRef } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { app } from '@/lib/firebase'
import img from '@/public/cloud-upload-regular-240.png'
import { useRouter } from 'next/navigation';

function page() {

  const router=useRouter();
  const fileRef = useRef()
  const[file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false)
  const[vidurl,setVidurl]=useState("")
  const [id, setId] = useState('');

  useEffect(() => {
    const getuserid = async () => {
      const response = await fetch('/api/me');
      const data = await response.json();
      console.log(data);
      
      setId(data._id);
    }
    getuserid();
  }, [setId]);

  useEffect(() => {
    if(file){
      handleFileUpload(file)
    }
  }, [file])
  const handleFileUpload = (file) => {
    const storage = getStorage(app)
    const fileName = file.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setFilePerc(Math.round(progress))
        },
      (error) => {
        setFileUploadError(true)
        },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
         
           setVidurl(downloadURL);
        })
      }
    )
  }


  const handlesubmit = async () => {
    try {
      if(!vidurl||!id){
        console.log("data not present");
        return;
      }
      const jsondata={
        vidurl:vidurl,
        id:id
      }
      console.log(jsondata);
      
      const res = await fetch("/api/vid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsondata),
      });
      const data = await res.json();
      console.log(data);
      
      if(data.success===false){
        toast.error(data.message);
        return
      }
      //router.push(`/room/${id}`);
      
    } catch (error) {
      console.log(error);
    }
  }

  console.log(vidurl);
  console.log(id);
  
    return (
        <div className="box">
            
            <form  className='flex flex-col gap-4'>
        <input onChange={(e)=>setFile(e.target.files[0])} type="file" ref={fileRef} className="hidden" accept="video/*" />
        <img onClick={() => fileRef.current.click()} className='mt-2 self-center cursor-pointer object-cover w-32 h-32 rounded-full' src={img} alt="" />
<p className='text-center'>
  {fileUploadError ? (
    <span className='text-red-500'>Upload Failed</span>
  ): filePerc >0&& filePerc < 100 ? (
      <span className='t ext-slate-500'>{filePerc}%</span>
    ): filePerc === 100 ? (
        <span className='text-green-500'>Uploaded Successfully</span>
      ): (
        ""
      )}
      </p>
      <button onClick={handlesubmit}>go to room</button>
      </form>
        </div>
    );
}

export default page;