import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SideBar from './components/utils/SideBar'
import MainPage from './components/MainPage/MainPage'
function App() {
  const [count, setCount] = useState(0)

  return (
    <div class="layout">
      <SideBar> </SideBar>
      <MainPage></MainPage>
    </div>
  )
}

export default App
