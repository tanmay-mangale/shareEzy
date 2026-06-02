import React from 'react'
import Landing from './pages/Landing'
import CreateRoom from './pages/CreateRoom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import JoinRoom from './pages/JoinRoom';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Landing/>} />
        <Route path='/room' element={<CreateRoom/>} />
        <Route path='/join' element={<JoinRoom/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App