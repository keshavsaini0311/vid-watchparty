"use client"

import React,{use, useState,useEffect} from 'react'
import { io } from 'socket.io-client'
let socket

const Chat = (props) => {
    const {roomId,username}=props
    const [messages,setMessages]=useState([{}]);
    
    const [message,setMessage]=useState({});
    console.log(messages);
    useEffect(() => {  
       socket=io();
      socket.on('msg', (msg) => {
        const newmsg={
          message:msg.message,
          username:msg.username
        }
        console.log(newmsg);
        console.log(msg);    
        setMessages(prevmessages=>[...prevmessages,newmsg]);    
        });
  }, []);


  const sendmessage=()=>{
    const msg={
      message:message,
      username:username
    }
    console.log(msg);
    
    socket.emit('msg_received',roomId,msg);
  }

  return (
    <div className="">

    <div>
      chat { username}
    </div>
    <div className="flex gap-4 justify-evenly">
      {
        messages.length>0&&messages.map((msg,index)=>
          <div key={index} className="">{msg.message}</div>
        )
      }

    <input onChange={(e)=>{setMessage(e.target.value)}} type="text" className=' mb-0 ' ></input>
    <button onClick={sendmessage} className=''>hi</button>
    </div>
    </div>
  )
}

export default Chat
