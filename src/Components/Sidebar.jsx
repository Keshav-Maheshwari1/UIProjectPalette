import React from 'react'

const Sidebar = ({sideBarShown}) => {
  return (
    <aside
    id="sidebar"
    className={`${
      sideBarShown ? "md:flex" : "hidden"
    } hidden relative col-start-1 col-end-2 bg-gray-600 z-[9999] row-start-2 row-end-3`}
  >
    <div
      id="sidebar-resize-line"
      className=" absolute top-0 -right-1 h-full w-[8px] cursor-e-resize hover:border-r-[4px] hover:border-r-[#548ae8]"
    ></div>
  </aside>
  )
}

export default Sidebar