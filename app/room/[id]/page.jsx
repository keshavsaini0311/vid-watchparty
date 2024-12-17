import React from 'react'

async function page ({params}) {
    
    const {id} = await params;
    
  return (
    <div>
      <h1>Room {id}</h1>
    </div>
  )
}

export default page
