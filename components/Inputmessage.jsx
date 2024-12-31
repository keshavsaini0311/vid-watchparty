import React,{useState} from 'react'
import { Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { io } from 'socket.io-client';

let socket=io();
export default function Inputmessage(props) {
    const [message,setMessage]=useState("");
    const user=props.user;
    const roomId=props.roomId;
    const sendmessage=(e)=>{
        e.preventDefault();
        if(message.trim()=="")return;
        const msg={
          message:message,
          username:user.username,
          time:new Date().toLocaleTimeString(),
          avatar:user.avatar
        }            
        setMessage('');
        socket.emit('msg_received',roomId,msg);
      }
  return (
    <div className='m-4'>
        <form className="flex">
            <Input type="text" value={message} className="md:w-72" onChange={(e)=>{setMessage(e.target.value)}} />
            <button type='submit' onSubmit={sendmessage} onClick={sendmessage} className=''><Send/></button>
        </form>
    </div>
  )
}
