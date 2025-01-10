import React, { useState} from 'react'
import chatIcon from "../assets/folktalk-gemini-removebg-preview-2.png"
import { toast, } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import  {createRoom as createRoomapi, joinChatApi} from "../Services/RoomService.js";
import useChatContext from '../context/ChatContext';
import { useNavigate } from 'react-router';
const Notification = ({ message, type, onClose }) => (
  <div
    className={`fixed top-5 left-1/2 transform -translate-x-1/2 p-4 rounded shadow-lg ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`}
  >
    {message}
    <button onClick={onClose} className="ml-4 font-bold">X</button>
  </div>
);



// import {setCurrentUser,setRoomId} from "../context/ChatContext"

const JoinCreateChat = () => {

  const [notification, setNotification] = useState(null);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 800);
  };

  
  const [detail,setDetail] = useState({
    roomId:"12345",
    userName:"abc",

  });
  const{roomId,userName,setRoomId,setCurrentUser,setConnected} = useChatContext();
  const navigate = useNavigate()

  function handleFormInputChange(event){
    setDetail({
      ...detail,
      [event.target.name]:event.target.value,
    });

  }
  async function joinChat(){
    if(validateForm()){
 
    try{
      const room =  await joinChatApi(detail.roomId);
      // toast.success("joined..");
      showNotification('You have joined the room' ,'success');
     
      setCurrentUser(detail.userName);
      setRoomId(room.roomId);
      setConnected(true);
      setTimeout(() => {
        navigate("/chat");
      }, 1000);


    }catch(error){
      if(error.status==400){
     showNotification(error.response.data,'error');
      }else{
      // toast.error("Please add correct Room Id");
      showNotification('Please try with correct roomID','error');
      }
    }

    
      // console.log(detail);


    }

  }

 async function createRoom(){
    if(validateForm()){
      // console.log(detail)
      try{
        const response = await createRoomapi(detail.roomId)
        console.log(response)
        showNotification('You have successfully created room. Chat with Folks !','success');
        setCurrentUser(detail.userName);
        setRoomId(response.roomId);
        setConnected(true);
        setTimeout(() => {
          navigate("/chat");
        }, 1000);

        // joinChat();

      }catch(error){
        console.log(error);
        if(error.status==400){
          showNotification("Room already exists. Try to create with new RoomID",'error');
        }else{
        console.log("Error in creating room");
        }

      }

    }

  }

  function validateForm(){
    if(detail.roomId =="" || detail.userName==""){
     toast.error("Invalid Input !!")
     return false;
    }

    return true;

  }





  return (
     <div className="min-h-screen flex items-center justify-center ">
<div className="p-10 dark:border-gray-700 border  w-full flex flex-col gap-5 max-w-md rounded dark:bg-gray-900 shadow">
  <div>
    <img src={chatIcon} className="w-2/3 mx-auto " />
  </div>
   
      <h1 className="text-2xl font-semibold text-center">Join Room/ Create Room</h1>
      <div className="">
        <label htmlFor="" className="block font-medium mb-2" >Your name</label>
        <input 
        onChange={handleFormInputChange}
        value={detail.userName}
       type ="text"
       name="userName"
       placeholder='Enter the name'
        id="name" className="w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 " />
      </div>

     
      <div className="">
        <label htmlFor="" className="block font-medium mb-2" >Room ID/new RoomID</label>
        <input
        name="roomId" 
        onChange={handleFormInputChange}
        value={detail.roomId}
        type="text"
        id="name" 
        placeholder="Enter RoomId" className="w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 " />
      </div>
      <div className="flex justify-center gap-5 mt-4 ">
        <button onClick={joinChat} className=" px-3 py-3 dark:bg-orange-500 hover:dark:bg-orange-800 rounded-2xl" >
          Join Room
        </button>

        <button onClick={createRoom} className=" px-3 py-3 dark:bg-blue-500 hover:dark:bg-blue-800 rounded-2xl" >
          Create Room
        </button>
      </div> 

      </div>
      {/* {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )} */}
      {/* <ToastContainer position="top-center" /> */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}


    </div>
   
    



  );
};

export default JoinCreateChat