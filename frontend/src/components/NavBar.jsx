import React from 'react'

const NavBar = () => {
  return (
    <div className='h-18 w-3/4 md:w-3/4 bg-purple-200 border-r-4 border-b-6 font-gilroy flex justify-center md:justify-between items-center px-15 rounded-4xl mt-10 '>
        <div className='text-xl font-bold'>ShareEzy</div>
        <div className='flex gap-18'>
          <a href="" className='text-xl hidden md:block font-semibold'>About</a>
        </div>
    </div>
  )
}

export default NavBar