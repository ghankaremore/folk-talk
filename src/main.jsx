
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter, Routes,Route} from "react-router";
import{Toaster} from "react-hot-toast"
import ChatPage from './componenets/ChatPage.jsx';
import {ChatProvider} from "./context/ChatContext.jsx";



createRoot(document.getElementById('root')).render(



    <BrowserRouter>
    <Toaster />

    <ChatProvider>
    <Routes>
    
      <Route  path="/" element={<App  />}  />
      <Route path="/chat" element={<ChatPage />
      } />
      <Route path="/about" element={<h1>This is about page</h1>} />
      <Route path="*" element={<h1>404 Page not found</h1>} />
    


    
      </Routes>
      </ChatProvider>
    </BrowserRouter>
 
)
