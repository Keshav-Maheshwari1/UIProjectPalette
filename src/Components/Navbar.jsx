import React from 'react'
import { Code, MenuIcon } from "lucide-react";
import { XIcon } from "lucide-react";

function Navbar({setSideBarShown, sideBarShown, file}) {
  return (
    <nav className=" flex flex-wrap text-white col-start-1 bg-gray-900 border-b border-b-gray-600 col-end-3 items-center row-start-1 row-end-2 ">
    <div className="relative w-10 h-10 ml-5 md:block hidden">
      <XIcon
        onClick={() => setSideBarShown(!sideBarShown)}
        size={28}
        className={` ${
          sideBarShown ? "opacity-100" : "opacity-0 hidden"
        } absolute top-[20%] left-0 nav-icons cursor-pointer`}
      />
      <MenuIcon
        onClick={() => setSideBarShown(!sideBarShown)}
        size={28}
        className={` ${
          sideBarShown ? "opacity-0 hidden" : "opacity-100"
        } absolute top-[20%] left-0 nav-icons cursor-pointer`}
      />
    </div>

    <button
      className=" hover:border hover:border-gray-400 rounded-md px-3 md:mx-2 mx-4 py-[2px]"
      onClick={() => {
        socketio.emit("input", "hi");
      }}
    >
      {file}
    </button>
  </nav>
  )
}

export default Navbar
