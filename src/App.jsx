import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import JoinCreateChat from './componenets/JoinCreateChat';

function App() {

 
  const [count, setCount] = useState(0)

  return (
   <div>
    
   <JoinCreateChat />
   </div>
  )
}

export default App
