import React, { useEffect, useState } from "react";
import { codeSnippets, languages } from "../constants/languages";
import { terminals } from "../constants/terminal";
import { Editor } from "@monaco-editor/react";
import { Code, MenuIcon } from "lucide-react";
import { XIcon } from "lucide-react";
import AI from "../Components/AI";
import Output from "../Components/Output";
import Problem from "../Components/Problem";
import Terminal from "../Components/Terminal";
import socketio from "../constants/server";
const EditorPage = () => {
  const [terminal, setTerminal] = useState("Terminal");
  const [language, setLanguage] = useState("c");
  const [sideBarShown, setSideBarShown] = useState(false);
  const [editorWidth, setEditorWidth] = useState(window.innerWidth);
  const [inputPrompt, setInputPrompt] = useState("");
  const [outputData, setOutputData] = useState([]);
  const [isWaiting, setIsWaiting] = useState(false);
  const [inputData, setInputData] = useState("");
  const [sideBarWidth, setSideBarWidth] = useState(0);
  const [editorHeight, setEditorHeight] = useState(403);
  const [terminalHeight, setTerminalHeight] = useState(0);
  const [editorContent, setEditorContent] = useState({
    lang: language,
    code: "",
    file: "",
    type: "",
  });
  const handleInput = (e) => {
    setInputData(e.target.value);
    if (e.key === "Enter") {
      socketio.emit("input", e.target.value);
      e.target.value = "";
    }
  };
  const terminalComponents = {
    Problem: <Problem />,
    Output: <Output />,
    Terminal: (
      <Terminal
        code={outputData}
        isWaiting={isWaiting}
        handleInput={handleInput}
      />
    ),
    AI: <AI />,
  };

  const handleSubmit = () => {
    setOutputData("");
    const input = document.getElementById("input-box");
    input.value = "";
    const updatedContent = {
      ...editorContent,
      lang: language,
      type: "run",
    };

    // Emit the updated state
    socketio.emit("code", updatedContent);
  };

  useEffect(() => {
    socketio.on("code", (data) => {
      const cleanedCode = data.code;

      if (data.type === "info") {
        setIsWaiting(true);
        const input = document.getElementById("input-box");
        input.focus();
        setInputPrompt(cleanedCode);
      } else {
        setIsWaiting(false);
        setInputPrompt("");
      }
      console.log(cleanedCode);
      setOutputData((prevOutputData) => [...prevOutputData, cleanedCode]);
    });
    socketio.on("err",(data)=>{
      console.log(data)
    })
    return () => {
      socketio.off("code");
      socketio.off("inputPrompt");
    };
  }, []);

  useEffect(() => {
    sideBarShown
      ? setEditorWidth(window.innerWidth - 200)
      : setEditorWidth(window.innerWidth);
    window.onresize = () => {
      setEditorWidth(window.innerWidth);
    };
  }, [sideBarShown]);

  const handleSelect = (e) => {
    setLanguage(
      e.currentTarget.value === "C++"
        ? "cpp"
        : e.currentTarget.value.toLowerCase()
    );
  };

  useEffect(() => {
    const sideBar = document.getElementById("sidebar");
    const resizeLine = document.getElementById("sidebar-resize-line");
    window.addEventListener("mousemove", function (e) {});

    resizeLine.addEventListener("mousedown", function (e) {
      e.preventDefault();
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResize);
    });

    function resize(e) {
      if (e.pageX >= 200 && e.pageX <= window.innerWidth - 400) {
        sideBar.style.width = e.pageX + "px";
        setEditorWidth(window.innerWidth - e.pageX);
        setSideBarWidth(e.pageX);
      }
    }

    function stopResize() {
      window.removeEventListener("mousemove", resize);
    }
  }, [sideBarWidth]);

  useEffect(() => {
    const resizeLine = document.getElementById("resize-line");
    const terminalContainer = document.getElementById("terminal-container");

    resizeLine.addEventListener("mousedown", function (e) {
      e.preventDefault();

      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResize);
    });
    function resize(e) {
      if (
        window.innerHeight - e.pageY >= 200 &&
        window.innerHeight - e.pageY <= 550
      ) {
        terminalContainer.style.height =
          window.innerHeight - e.pageY - 1 + "px";
        setEditorHeight(e.pageY - 101);
        setTerminalHeight(window.innerHeight - e.pageY - 1);
      }

      console.log(e.pageY);
    }

    function stopResize() {
      window.removeEventListener("mousemove", resize);
    }
  }, [terminalHeight]);

  return (
    <main
      id="editor-page"
      className={`${
        sideBarWidth !== 0
          ? `grid-cols-[${sideBarWidth}px_1fr]`
          : "grid-cols-[200px_1fr]"
      }   bg-black overflow-hidden`}
    >
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
          {codeSnippets[language]?.file}
        </button>
      </nav>
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
      {/* <!-- Left Section: Resizable Horizontally --> */}
      <section
        className={`grid overflow-hidden ${
          terminalHeight !== 0
            ? `grid-rows-[50px_1fr_${terminalHeight}px]`
            : "grid-rows-[50px_1fr_200px]"
        }  ${
          sideBarShown ? "md:col-start-2 " : "md:col-start-1"
        } col-start-1 col-end-3 `}
      >
        {/* <!-- Header Section --> */}
        <header
          style={{ minHeight: 40 }}
          className="bg-black text-[#222831] row-start-1 row-end-2 flex flex-wrap items-center justify-between max-w-full px-4"
        >
          <select
            onChange={handleSelect}
            name="lang"
            id="lang"
            className="text-white bg-black outline-none border-gray-400 border px-3 py-1 rounded-md"
          >
            {languages.map((lang, i) => (
              <option value={lang.language} key={i}>
                {lang.language === "cpp"
                  ? "C++"
                  : lang.language[0].toLocaleUpperCase() +
                    lang.language.slice(1, lang.language.length)}
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
          theme="vs-dark"
          height={editorHeight}
          className="row-start-2 row-end-3"
          value={codeSnippets[language]?.code}
          onChange={(value) =>
            setEditorContent({
              ...editorContent,
              code: value,
              lang: "python",
            })
          }
          width={editorWidth - 1}
        />

        <footer
          id="terminal-container"
          className="relative text-[gray] row-start-3 row-end-4 z-[999] bg-gray-600/30 grid grid-rows-[40px_1fr] border-t-[1.4px] border-t-gray-500"
        >
          <div
            id="resize-line"
            className=" absolute -top-1 z-[999] left-0 w-full h-[30px] hover:border-t-[5px] cursor-s-resize hover:border-t-[blue]"
          ></div>
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
          {terminalComponents[terminal]}
        </footer>
      </section>
    </main>
  );
};

export default EditorPage;
