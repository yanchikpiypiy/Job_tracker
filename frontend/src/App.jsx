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
import Settings from './components/SettingsPage/Settings';
import { ThemeProvider } from './components/context/ThemeContext';
function App() {

    return (
        <AuthProvider>
            <ApplicationsProvider>
                <MeetingsProvider>
                    <DocumentsProvider>
                        <ThemeProvider>
                            <Router>
                                <Routes>
                                    <Route path="dashboard" element={<MainPage></MainPage>}></Route>
                                    <Route path="jobs" element={<ApplicationsList></ApplicationsList>}></Route>
                                    <Route path="" element={<AuthPage></AuthPage>}></Route>
                                    <Route path='calendar' element={<MeetingCalendar></MeetingCalendar>}></Route>
                                    <Route path='documents' element={<Documents></Documents>}> </Route>
                                    <Route path='profile' element={<ProfilePage></ProfilePage>}> </Route>
                                    <Route path='settings' element={<Settings></Settings>}></Route>
                                </Routes>
                            </Router>
                        </ThemeProvider>

                    </DocumentsProvider>
                </MeetingsProvider>
            </ApplicationsProvider>
        </AuthProvider>


    )
}

export default App
