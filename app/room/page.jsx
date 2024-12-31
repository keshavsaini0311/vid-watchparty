"use client"
import { useState,useEffect,useRef } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { app } from '@/lib/firebase'
import { useRouter } from 'next/navigation';

function page() {

  const router=useRouter();
  const fileRef = useRef()
  const[file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false)
  const[formdata,setformdata]=useState({
    vidurl:"",
    id:"",
  })

  useEffect(() => {

    const getuserid = async () => {
      try{
      const response = await fetch('/api/me');
      const data = await response.json();
      console.log(data);
      setformdata({...formdata,id:data._id})
      }catch(error){
        console.log(error);
      }
    }
    getuserid();
  }, [setformdata]);

  useEffect(() => {
    if(file){
      handleFileUpload(file)
    }
  }, [file])
  const handleFileUpload = (file) => {
    const storage = getStorage(app)
    const fileName = formdata.id
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
         
          setformdata({...formdata,vidurl:downloadURL})
        })
      }
    )
  }


  const handlesubmit = async (event) => {
    event.preventDefault();
    try{
      const res = await fetch("/api/vid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      const data = await res.json();
      console.log(data);
      
      if(data.success===false){
        console.log(data.message);
        return
      }
      router.push(`/room/${formdata.id}`);
    }catch(error){
      console.log(error);
    }
    
  }

  
    return (
        <div className="box">
            
            <form  className='flex flex-col gap-4 p-4'>
        <div className="flex items-center justify-center w-full">
    <label onClick={() => fileRef.current.click()} htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">mp4</p>
        </div>
        <input onChange={(e)=>setFile(e.target.files[0])} type="file" ref={fileRef} className="hidden" accept="video/*" />
    </label>
</div> 

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
      {formdata.vidurl!==""&&
      <button onClick={handlesubmit}>go to room</button>
      } 
      </form>
        </div>
    );
}

export default page;