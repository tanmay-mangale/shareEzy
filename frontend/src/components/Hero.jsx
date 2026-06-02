import React from 'react'
import { Pencil } from 'lucide-react';
import { Merge } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const Hero = () => {
  const navigate=useNavigate();
  
  function gotoRoom(){
    navigate("/room");
  }

  function gotoJoinRoom(){
    navigate("/join")
  }
  
  return (
    <div className='flex gap-10 flex-col justify-center items-center h-3/4 w-full'>
        <div className='mb-5 md:mb-0'>
            <h1 className='text-3xl md:text-4xl md:mt-10 text-center font-bold'>Share files anytime, anywhere <br /> instantly, securely, and without limits</h1>
            <p className='text-xl mt-4 md:mt-5 text-center md:text-2xl'>A file transfering platform</p>
        </div>
        <div className='flex flex-col items-center gap-4 md:gap-0 md:flex-row justify-center w-full' >
            <button className='bg-green-200 text-xl w-3/4 md:w-60 flex justify-center py-3 hover:cursor-pointer px-10 md:mr-10 rounded-2xl' onClick={gotoRoom}>Create room<Pencil className='ml-2' /></button>
            <button className='border-1 px-10 text-xl w-3/4 md:w-60  flex justify-center py-3 rounded-2xl hover:cursor-pointer' onClick={gotoJoinRoom}>Join room <Merge className='ml-2' /></button>
        </div>
    </div>
  )
}

export default Hero