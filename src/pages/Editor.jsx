import React, { useEffect, useState } from "react";
import { languages } from "../constants/languages";
import { terminals } from "../constants/terminal";
import { Editor } from "@monaco-editor/react";
import { Code, MenuIcon } from "lucide-react";
import { XIcon } from "lucide-react";
import socketio from "../constants/server";
const EditorPage = () => {
  const [terminal, setTerminal] = useState("Terminal");
  const [language, setLanguage] = useState("javascript");
  const [sideBarShown, setSideBarShown] = useState(false);
  const [editorWidth, setEditorWidth] = useState(window.innerWidth);
  const [inputPrompt, setInputPrompt] = useState(null);
  const [outputData, setOutputData] = useState([]);
  const [editorContent, setEditorContent] = useState(
    {
      lang: "python",
      code: "",
      file: "",
      type: "",
    },
  );
  const handleSubmit = () => {
    const updatedContent = {
      ...editorContent,
      type: "run",
    };
    setEditorContent(updatedContent);

    // Emit the updated state
    socketio.emit("code", updatedContent);
  };
  useEffect(() => {
    socketio.on("code", (data) => {
      const cleanedCode = data.code.replace(/[\r\n]/g, "").trim(); // Remove all \r and \n characters
      setOutputData((prevOutputData) => [...prevOutputData, cleanedCode]);
      console.log(cleanedCode);
    });

    // Cleanup listener on unmount
    return () => {
      socketio.off("code");
    };
  }, []);
  const handleInput = (input) => {
    socketio.emit("input", input);
    setInputPrompt("");
  };
  // const handleValidation = (markers)=> {
  //   markers.forEach(marker=> console.log('onValidate', marker.message))
  // }
  useEffect(() => {
    sideBarShown
      ? setEditorWidth(window.innerWidth - 200)
      : setEditorWidth(window.innerWidth);
    window.onresize = () => {
      setEditorWidth(window.innerWidth);
    };
    console.log(editorWidth);
  }, [sideBarShown]);

  return (
    <main id="editor-page" className={`  bg-black overflow-hidden`}>
      <nav className=" flex flex-wrap text-white col-start-1 bg-gray-900 border-b border-b-gray-600 col-end-3 items-center row-span-1">
        {sideBarShown ? (
          <XIcon
            onClick={() => setSideBarShown(!sideBarShown)}
            size={28}
            className="m-4 cursor-pointer md:block hidden"
          />
        ) : (
          <MenuIcon
            onClick={() => setSideBarShown(!sideBarShown)}
            size={28}
            className=" m-4 cursor-pointer md:block hidden"
          />
        )}
        <button className=" hover:border hover:border-gray-400 rounded-md px-3 md:mx-2 mx-4 py-[2px]">
          Files
        </button>
      </nav>
      <aside
        className={`${
          sideBarShown ? "md:flex" : "hidden"
        } hidden resize-x bg-gray-900/25`}
      ></aside>
      {/* <!-- Left Section: Resizable Horizontally --> */}
      <section
        className={`grid grid-rows-[50px_1fr_200px] ${
          sideBarShown ? "md:col-start-2 " : "md:col-start-1"
        } col-start-1 col-end-3 row-span-1`}
      >
        {/* <!-- Header Section --> */}
        <header className="bg-black text-[#222831] flex flex-wrap items-center justify-between max-w-full px-4">
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
          <button
            className="border text-white border-gray-400 px-3 lg:mr-12 py-1 rounded"
            onClick={handleSubmit}
          >
            Run
          </button>
        </header>
        {/* <!-- Main Content Area --> */}

        <Editor
          defaultLanguage={language}
          language={language}
          defaultValue=""
          theme="vs-dark"
          className=""
          value={editorContent.code}
          onChange={(value) =>
            setEditorContent({
              ...editorContent,
              code: value,
              lang: 'python',
            })
          }
          width={editorWidth}
        />

        <footer className=" text-[gray] bg-[#101010] h-full border-t-[1.4px] border-t-gray-500">
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
            <button
              className="ml-auto hover:text-gray-300 cursor-pointer pt-1 lg:mr-12"
              onClick={handleSubmit}
            >
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
