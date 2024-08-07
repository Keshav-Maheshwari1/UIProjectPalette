import React, { useContext, useEffect, useState } from "react";
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
import { RoomContext } from "../context/RoomContext";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import Footer from "../Components/Footer";

const EditorPage = () => {
  const { roomData, setRoomData } = useContext(RoomContext);
  const [terminal, setTerminal] = useState("Terminal");
  const [language, setLanguage] = useState("c");
  const [sideBarShown, setSideBarShown] = useState(false);
  const [editorWidth, setEditorWidth] = useState(window.innerWidth);
  const [inputPrompt, setInputPrompt] = useState("");
  const [outputData, setOutputData] = useState([]);
  const [isWaiting, setIsWaiting] = useState(false);
  const [sideBarWidth, setSideBarWidth] = useState(0);
  const [editorHeight, setEditorHeight] = useState(window.innerHeight - 300);
  const [terminalHeight, setTerminalHeight] = useState(0);

  useEffect(() => {
    setRoomData({
      ...roomData,
      lang: language,
      file: codeSnippets[language]?.file,
    });
  }, []);
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
      ...roomData,
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
        // setInputPrompt(cleanedCode);
      } else {
        setIsWaiting(false);
        // setInputPrompt("");
      }
      console.log(cleanedCode);
      setOutputData((prevOutputData) => [...prevOutputData, cleanedCode]);
    });
    socketio.on("err", (data) => {
      console.log(data);
    });
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
      setEditorHeight(window.innerHeight - 300);
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
      <Navbar
        file={codeSnippets[language]?.file}
        sideBarShown={sideBarShown}
        setSideBarShown={setSideBarShown}
      />
      <Sidebar sideBarShown={sideBarShown} />
      {/* <!-- Left Section: Resizable Horizontally --> */}
      <section
        className={`grid overflow-hidden ${
          terminalHeight !== 0
            ? `grid-rows-[50px_1fr_${terminalHeight}px]`
            : "grid-rows-[50px_auto_200px]"
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
            setRoomData({
              ...editorContent,
              code: value,
              lang: "python",
            })
          }
          width={editorWidth - 1}
        />

        <Footer
          setTerminal={setTerminal}
          terminal={terminal}
          handleSubmit={handleSubmit}
          terminalComponents={terminalComponents}
          terminals={terminals}
        />
      </section>
    </main>
  );
};

export default EditorPage;
