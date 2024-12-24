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
            
            <form  className='flex flex-col gap-4'>
        <input onChange={(e)=>setFile(e.target.files[0])} type="file" ref={fileRef} className="hidden" accept="video/*" />
        <img onClick={() => fileRef.current.click()} className='mt-2 self-center cursor-pointer object-cover w-32 h-32 rounded-full' src="https://www.google.com/imgres?q=image%20placeholder&imgurl=https%3A%2F%2Fwww.svgrepo.com%2Fshow%2F508699%2Flandscape-placeholder.svg&imgrefurl=https%3A%2F%2Fwww.svgrepo.com%2Fsvg%2F508699%2Flandscape-placeholder&docid=9QbaVFfobw8WtM&tbnid=ILb0VdrDiOSHxM&vet=12ahUKEwjS9Pmbm8CKAxVU4jgGHVTuNjwQM3oECB0QAA..i&w=800&h=800&hcb=2&ved=2ahUKEwjS9Pmbm8CKAxVU4jgGHVTuNjwQM3oECB0QAA" alt="" />
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