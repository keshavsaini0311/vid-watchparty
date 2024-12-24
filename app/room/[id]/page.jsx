"use client"
import React,{useEffect, useState,use} from 'react'

const page  = ({params}) => {
    
    const {id} = use(params);
    const [vidurl, setVidurl] = useState('');

    useEffect(() => {
        async function getvid() {
          try {
            const response = await fetch(`/api/me`);
            const data = await response.json();
            setVidurl(data.vidurl);
          } catch (error) {
            console.log(error);
          }
        }
        getvid();
      }, []);

      console.log(vidurl);
      
        
  return (
    <div>
      <h1>Room {id}</h1>
      {vidurl &&
      <video controls>
        <source src={vidurl} type="video/mp4" />
      </video>
}
    </div>
  )
}

export default page
