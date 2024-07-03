import React, { useState } from "react";
import Brain from "../assets/brain.svg";
import { useNavigate } from "react-router-dom";
const Room = () => {

  const [roomData, setRoomData] = useState({
    name: '',
    id: ''
  })
  const handleSubmit = (e) => {
    e.preventDefault();
    setRoomData({...roomData, name: e.target.name.value, id: e.target.roomId.value})
   if([roomData.id, roomData.name].some(val=> val!=="")) {
    window.location.href="http://localhost:5173/editor"
   }
    
  };

  return (
    <main
      className="h-screen w-screen bg-cover bg-center flex justify-center items-center"
      style={{ backgroundImage: `url(${Brain})` }}
    >
      <div className="backdrop-blur-lg bg-white/10 h-2/5 w-11/12 sm:w-4/5 md:w-2/5 lg:w-1/3 xl:w-1/4 rounded-md shadow-lg p-6">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label htmlFor="name" className="text-xl font-bold">
            Name:
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-600"
          />
          <label htmlFor="roomId" className="text-xl font-bold">
            Room ID:
          </label>
          <input
            type="text"
            name="roomId"
            id="roomId"
            className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-600"
          />
          <button
            type="submit"
            className="w-full h-10 bg-black/60 text-white rounded-md hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-gray-600 transition duration-200"
          >
            Join
          </button>
        </form>
      </div>
    </main>
  );
};

export default Room;
