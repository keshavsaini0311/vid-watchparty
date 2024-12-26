"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function Home() {

  const router=useRouter();
  const [roomId, setRoomId] = useState("");
  const handleClick=()=>{
    router.push(`/room/${roomId}`);
  }

  return (
    <div className='w-full  mx-auto py-24 text-center flex flex-col gap-28'>
        <div className="border flex-col border-gray-700 shadow-lg shadow-gray-700 mx-auto bg-gradient-to-tr from-zinc-800 to-neutral-950 rounded-3xl w-96 h-40 flex items-center justify-center">
            <input onChange={(e) => setRoomId(e.target.value)} type="text" className="border p-2 m-1 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600" placeholder="Room ID" ></input>
            <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
              <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
              <span className="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
              <button onClick={handleClick} className="relative">Join WatchParty</button>
            </span>
            <span className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0" data-rounded="rounded-lg"></span>
        </div>
        <div className="border border-gray-700 shadow-lg shadow-gray-700 mx-auto bg-gradient-to-tr from-zinc-800 to-neutral-950 rounded-3xl w-96 h-40 flex items-center justify-center">
          <Link href="/room" className="relative inline-block text-lg group">
            <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
              <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
              <span className="absolute left-0 w-96 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
              <span className="relative">Create WatchParty</span>
            </span>
            <span className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0" data-rounded="rounded-lg"></span>
          </Link>
        </div>
    </div>
  );
}
