import './App.css'
import MainPage from './components/MainPage/MainPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ApplicationsList from './components/ApplicationPage/ApplicationList'
import AuthPage from './components/AuthPage/AuthPage'
import { AuthProvider } from './components/context/UserContext'
import MeetingCalendar from './components/CalendarPage/MeetingCalendarPage'
import { ApplicationsProvider } from './components/context/ApplicationContext'
import { MeetingsProvider } from './components/context/MeetingContext'
import { DocumentsProvider } from './components/context/DocumentContext';
import Documents from './components/DocumentsPage/Documents'
import ProfilePage from './components/ProfilePage/ProfilePage';
function App() {

  return (
    <AuthProvider>
      <ApplicationsProvider>
        <MeetingsProvider>
          <DocumentsProvider>
            <Router>
              <Routes>
                <Route path="dashboard" element={<MainPage></MainPage>}></Route>
                <Route path="jobs" element={<ApplicationsList></ApplicationsList>}></Route>
                <Route path="login" element={<AuthPage></AuthPage>}></Route>
                <Route path='calendar' element={<MeetingCalendar></MeetingCalendar>}></Route>
                <Route path='documents' element={<Documents></Documents>}> </Route>
		<Route path='profile' element={<ProfilePage></ProfilePage>}> </Route>
              </Routes>
            </Router>
          
          </DocumentsProvider>
        </MeetingsProvider>
      </ApplicationsProvider>
    </AuthProvider>
   
    
  )
}

export default App
