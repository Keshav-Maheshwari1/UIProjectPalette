import React, { useEffect, useState } from "react";
import { languages } from "../constants/languages";
import { terminals } from "../constants/terminal";
import { Editor } from "@monaco-editor/react";
import { MenuIcon } from "lucide-react";
import { XIcon } from "lucide-react";
import jQuery from "jquery";

const EditorPage = () => {
  const [terminal, setTerminal] = useState("Terminal");
  const [language, setLanguage] = useState("javascript");
  const [sideBarShown, setSideBarShown] = useState(false);

  // const handleValidation = (markers)=> {
  //   markers.forEach(marker=> console.log('onValidate', marker.message))
  // }
  return (
    <main
      className={`grid grid-rows-[60px_1fr] min-h-screen overflow-hidden  bg-black ${sideBarShown ? 'grid-cols-[200px_1fr]': 'grid-cols-[1fr]'}`}
    >
      <nav className=" w-full flex text-white col-start-1 col-end-3 items-center row-span-1">
        {sideBarShown ? (
          <XIcon onClick={()=> setSideBarShown(!sideBarShown)} size={28} className="m-4" />
        ) : (
          <MenuIcon onClick={()=> setSideBarShown(!sideBarShown)} size={28} className=" m-4" />
        )}
        <button className=" hover:border hover:border-gray-400 rounded-md px-3 py-[2px]">Files</button>
      </nav>
      {sideBarShown ? (
        <aside className={` col-start-1 col-end-2 row-start-2 row-end-3 bg-white text-white`}>
          {/* <!-- Additional content can go here --> */}
        </aside>
      ) : (
        ""
      )}
      {/* <!-- Left Section: Resizable Horizontally --> */}
      <section className={`grid grid-rows-[80px_1fr_250px] ${sideBarShown? 'col-start-2 col-end-3' : 'col-start-1'} row-span-1`}>
        {/* <!-- Header Section --> */}
        <header className="bg-black text-[#222831] flex flex-col justify-center px-4">
          <div className=" flex items-center justify-between flex-wrap w-full mb-3">
            <select
              name="lang"
              id="lang"
              className="text-white bg-black outline-none border-gray-400 border px-3 py-1 rounded-md"
            >
              {languages.map((lang, i) => (
                <option value={lang} key={i}>
                  {lang}
                </option>
              ))}
            </select>
            <button className="border text-white border-gray-400 px-3 py-1 rounded">
              Run
            </button>
          </div>
        </header>
        {/* <!-- Main Content Area --> */}
        <Editor
          defaultLanguage={language}
          language={language}
          defaultValue=""
          theme="vs-dark"
          className=" row-start-2 row-end-3"
        />
        {/* <article className="bg-[#222831] text-white text-2xl resize-y h-full outline outline-1 outline-[#3b434f] p-3 overflow-auto">
          Write your code here
        </article> */}
        {/* <!-- Footer Section --> */}
        <footer className=" text-[gray] row-start-3 row-end-4 bg-[#181818] h-full border-t-[1.4px] border-t-gray-500">
          <div className="flex gap-4 w-full px-4">
            {terminals.map((term, i) => (
              <button
                key={i}
                onClick={() => setTerminal(term)}
                className={`${
                  terminal === term ? "border-b-[#43aff7] border-b" : ""
                } px-2 pt-2 cursor-pointer hover:text-gray-300`}
              >
                {term}
              </button>
            ))}
            <button className="ml-auto hover:text-gray-300 cursor-pointer">
              Close
            </button>
          </div>
          <div className=" px-6 pt-2">{terminal}</div>
        </footer>
      </section>

    </main>
  );
};

export default EditorPage;
