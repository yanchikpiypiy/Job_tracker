import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SideBar from './components/utils/SideBar'
import MainPage from './components/MainPage/MainPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ApplicationsList from './components/ApplicationPage/ApplicationList'
function App() {

  return (
    <Router>
      <Routes>
        <Route path="dashboard" element={<MainPage></MainPage>}></Route>
        <Route path="jobs" element={<ApplicationsList></ApplicationsList>}></Route>
      </Routes>
      
    </Router>
    
  )
}

export default App
