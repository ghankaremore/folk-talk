import React,{useState,useRef, useEffect} from 'react'
// import MdSend from 'react-icons'
import email from '../assets/email.png'
import file from '../assets/file.png'
import useChatContext from '../context/ChatContext'
import {useNavigate} from "react-router";
import SockJS from "sockjs-client";
import {Stomp}  from "@stomp/stompjs";
import toast from "react-hot-toast";

import { baseURL } from '../config/AxiosHelper';
import { getMessages } from '../Services/RoomService';
import { timeAgo } from '../config/helper';





const ChatPage = () => {
    const {roomId,currentUser,connected,setConnected,setRoomId,setCurrentUser} = useChatContext();

    // console.log(roomId);
    // console.log(currentUser);
    // console.log(connected);

    const navigate = useNavigate()
    

    useEffect((
        
    )=>{
        if(!connected){
            navigate("/");
        }
        
    

    },[connected,roomId,currentUser]);

const [messages,setMessages]=useState([
   
]);
const[input,setInput]=useState("");
const inputRef=useRef(null);
const chatBoxRef=useRef(null);
const [stompClient,setStompClient] = useState(null);

useEffect(()=>{
    async function loadMessages(){
        try{
           const messages =  await getMessages(roomId);
           console.log(messages);
           setMessages(messages);
            
        }catch(error){

        }
       
    }
    if(connected){
    loadMessages();
    }
    
},[]);

useEffect(()=>{
    if(chatBoxRef.current){
        chatBoxRef.current.scroll({
            top:chatBoxRef.current.scrollHeight,behavior:"smooth",
      })
    }
},[messages])


// const[roomId,setRoomId] = useState("");
// const[currentuser]=
// useState('Ghanesh')
useEffect(()=>{
    const connectWebSocket= () =>{
        const sock = new SockJS(`${baseURL}/chat`)
        const client = Stomp.over(sock)

        client.connect({},()=>{
        setStompClient(client);

        // toast.success("connected");
        console.log("connected");

        client.subscribe(`/topic/room/${roomId}`,(message)=>{
        console.log(message);
        const newMessage = JSON.parse(message.body);
        setMessages((prev)=>[...prev,newMessage]); 

        });
    });
    
};

if(connected){
connectWebSocket();
}
    

},[roomId]);

const sendMessage=async ()=>{
    if(stompClient && connected  && input.trim() ){
console.log(input);
const message ={
    sender:currentUser,
    content:input,
    roomId:roomId

}

stompClient.send(`/app/sendMessage/${roomId}`,{},JSON.stringify(message));
setInput("")

}

    
}




 


 function handleLogout(){
    stompClient.disconnect()
    setConnected(false)
    setRoomId('')
    setCurrentUser("");
    navigate("/")

    navigate
 }

  return (
    <div className=""> 
        <header className=" dark:border-gray-700  fixed w-full dark:bg-gray-900 shadow flex px-2 py-4  justify-around items-center">

            <div className="text-xl font-semibold">
                <h1>Room : <span>{roomId}</span></h1>
            </div>
            <div className="text-xl font-semibold">
            <h1>User : <span>{currentUser}</span></h1>
                
            </div>
            <div> 
                <button onClick={handleLogout} className="dark:bg-red-500 dark:hover-bg-red-700 px-3 py-2 rounded-full">Leave Room</button>

            </div>
        </header>

        <main ref={chatBoxRef} className='py-20 px-10 w-2/3 dark:bg-slate-800 mx-auto h-screen overflow-auto '>
           

           { messages.map((message,index)=>( 
            <div key={index} className={`flex ${message.sender==currentUser?"justify-end":"justify-start" }`}>
               <div key={index} className={`my-2  ${message.sender==currentUser?'bg-orange-400': 'bg-blue-500' }  p-2 max-w-xs rounded`}>
                <div className="flex flex-row gap-2">
                    <img className='h-9 w-9' src="https://avatar.iran.liara.run/public/16" alt="" />
                <div className=' flex flex-col gap-1'>

              <p className=" text-sm font-bold">  {message.sender}</p>
              <p>{message.content}</p>
              <p className="text-xs text-gray-200">{timeAgo(message.timeStamp)}</p>
                </div>
                </div>
                   

               </div>
               </div>
            ))}
            


        </main>







        <div className=" fixed bottom-2 w-full h-12">
            <div className='h-full px-5   w-2/3 mx-auto  flex items-center justify-between gap-2 '>
            <input  value={input} onChange={(e)=>{
                setInput(e.target.value);
            }}
            onKeyDown={(e)=>{
                if(e.key=="Enter"){
                    sendMessage();
                }
                
                }} type="text" placeholder='Tyepe your Message here' className='dark:border-gray-700 dark:bg-gray-900 px-5 py-2 rounded-lg  h-full w-full focus:outline-none '  />
            <button className=' rounded  h-9 w-16  flex justify-center items-center right-0'>
               <img src={file} alt="" className='w-12 h-10 '  />
                
            </button>

            <button onClick={sendMessage} className=' rounded  h-9 w-16  flex justify-center items-center right-0'>
               <img src={email} alt="" className='w-11 h-10 '  />
                
            </button>
            </div>
            
           
            

        </div>

    </div>
  )
}

export default ChatPage