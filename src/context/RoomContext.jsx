import React, { createContext, useState } from "react";

export const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
  const [roomData, setRoomData] = useState({
    roomId: null,
    hostName: "",
    lang: "",
    code: "",
    file: "",
    type: "",
  });
  return (
    <RoomContext.Provider value={{ roomData, setRoomData }}>
      {children}
    </RoomContext.Provider>
  );
};
