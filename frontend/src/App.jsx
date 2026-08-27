import React from 'react'
import Landing from './pages/Landing'
import CreateRoom from './pages/CreateRoom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import JoinRoom from './pages/JoinRoom';
import About from './pages/About';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Landing/>} />
        <Route path='/room' element={<CreateRoom/>} />
        <Route path='/join' element={<JoinRoom/>} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App