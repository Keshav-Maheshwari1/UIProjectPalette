import React from "react";

const Editor = () => {
  return (
    <main className="flex md:flex-row-reverse h-screen">
      {/* <!-- Left Section: Resizable Horizontally --> */}
      <section className="grid grid-rows-3 min-w-[60%] md:float-right h-full md:h-screen resize-x overflow-auto">
        {/* <!-- Header Section --> */}
        <header className="bg-black text-[#222831] flex justify-between items-center outline outline-[#3b434f] p-3">
          <p>Shows all the open folders</p>
          <button className="border border-white px-3 py-1 rounded">Run</button>
        </header>
        {/* <!-- Main Content Area --> */}
        <article className="bg-[#222831] text-white text-2xl resize-y h-full outline outline-1 outline-[#3b434f] p-3 overflow-auto">
          Write your code here
        </article>
        {/* <!-- Footer Section --> */}
        <footer className="bg-black text-[#222831] h-full border-t-1 border-l-2 outline-[#3b434f] p-3">
          <div className="flex gap-4 w-full">
            <button className="focus:bg-gradient-to-r focus:from-white focus:to-black focus:bg-right bg-left bg-no-repeat transition-all duration-500 px-3 py-1 rounded">
              Problem
            </button>
            <button className="focus:bg-gradient-to-r focus:from-white focus:to-black focus:bg-right bg-left bg-no-repeat transition-all duration-500 px-3 py-1 rounded">
              Output
            </button>
            <button className="focus:bg-gradient-to-r focus:from-white focus:to-black focus:bg-right bg-left bg-no-repeat transition-all duration-500 px-3 py-1 rounded">
              Terminal
            </button>
            <button className="focus:bg-gradient-to-r focus:from-white focus:to-black focus:bg-right bg-left bg-no-repeat transition-all duration-500 px-3 py-1 rounded">
              AI
            </button>
            <button className="ml-auto focus:bg-gradient-to-r focus:from-white focus:to-black focus:bg-right bg-left bg-no-repeat transition-all duration-500 px-3 py-1 rounded">
              Close
            </button>
          </div>
        </footer>
      </section>
      {/* <!-- Right Section: Resizable Vertically --> */}
      <aside className="flex-grow resize-y overflow-auto bg-black text-white">
        {/* <!-- Additional content can go here --> */}
        I will show you how much members are connected
      </aside>
    </main>
  );
};

export default Editor;
