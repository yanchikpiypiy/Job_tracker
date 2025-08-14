import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SideBar from './components/utils/SideBar'
import MainPage from './components/MainPage/MainPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ApplicationsList from './components/ApplicationPage/ApplicationList'
import AuthPage from './components/AuthPage/AuthPage'
import { AuthProvider } from './components/context/UserContext'
import MeetingCalendar from './components/CalendarPage/MeetingCalendarPage'
import { ApplicationsProvider } from './components/context/ApplicationContext'
import { MeetingsProvider } from './components/context/MeetingContext'
import Documents from './components/DocumentsPage/Documents'
function App() {

  return (
    <AuthProvider>
      <ApplicationsProvider>
        <MeetingsProvider>
          <Router>
                  <Routes>
                    <Route path="dashboard" element={<MainPage></MainPage>}></Route>
                    <Route path="jobs" element={<ApplicationsList></ApplicationsList>}></Route>
                    <Route path="login" element={<AuthPage></AuthPage>}></Route>
                    <Route path='calendar' element={<MeetingCalendar></MeetingCalendar>}></Route>
                    <Route path='documents' element={<Documents></Documents>}> </Route>
                  </Routes>
              </Router>
        </MeetingsProvider>
            
          
      </ApplicationsProvider>
    </AuthProvider>
   
    
  )
}

export default App
