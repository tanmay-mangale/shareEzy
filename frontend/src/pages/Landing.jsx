import React from 'react'
import NavBar from '../components/NavBar'
import Hero from '../components/Hero'

const Landing = () => {
  return (
    <div className='flex flex-col h-screen  items-center'>
      <NavBar/>
      <Hero/>
    </div>
  )
}

export default Landing