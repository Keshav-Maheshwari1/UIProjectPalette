import React, { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { io } from "socket.io-client";

let socket;

const AI = () => {
  const [loading, setLoading] = useState(false);
  const [prompts, setPrompts] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socketInitializer();
  }, []);

  async function socketInitializer() {
    socket = io();

    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("udate-input", (msg) => {
      setInput(msg);
    });

    return null;
  }

  let loaderInterval;

  const loader = (element) => {
    element.textContent = "";

    loaderInterval = setInterval(() => {
      element.textContent += ".";
      if (element.textContent === "....") {
        element.textContent = ".";
      }
    }, 300);
  };

  const typeText = (element, text) => {
    let index = 0;
    console.log(text);
    let interval = setInterval(() => {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 20);
  };

  function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
  }
  const genAi = new GoogleGenerativeAI(
    "AIzaSyCeMP7ZTPtMJX-hyHHoUn3VItarq6gGG4Y"
  );

  function chatStripe(isAi, value, uniqueId) {
    return `
        <div class="wrapper ${isAi && "ai"}">
            <div>

                <pre id=${uniqueId} style="color: white;">Q. ${value}</pre>
            </div>
        </div>
    `;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = document.querySelector("form");
    const data = new FormData(form);
    const chatContainer = document.querySelector("#chat-container");
    chatContainer.innerHTML += chatStripe(false, data.get("prompt"));

    form.reset();

    const uniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe(true, "", uniqueId);

    chatContainer.scrollTop = chatContainer.scrollHeight;

    const msgDiv = document.getElementById(uniqueId);
    loader(msgDiv);

    const model = genAi.getGenerativeModel({ model: "gemini-pro" });
    try {
      console.log(data.get("prompt"));
      setLoading(true);
      const result = await model.generateContent(data.get("prompt"));
      const response = result.response;
      const text = response.text();

      clearInterval(loaderInterval);
      msgDiv.innerHTML = "";

      typeText(msgDiv, text);
    } catch (error) {
      console.error("Error generating content:", error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setInput(() => e.target.value);
    socket.emit("input-change", e.target.value);
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const handleNewLine = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
    }
  };
  return (
    <section className=" w-full bg-gray-500/20 row-start-2 row-end-3 grid grid-rows-[1fr_60px] px-4 overflow-y-auto">
      <div
        id="answer-container"
        className="text-white w-[80%] mx-auto p-5 break-words text-wrap"
      >
        <div id="chat-container"></div>
      </div>
      <form
        onSubmit={(e) => handleSubmit(e)}
        onKeyUp={(e) => handleChange(e)}
        className="w-[80%] mx-auto"
      >
        <textarea
          name="prompt"
          placeholder="Ask To AI"
          onKeyDown={handleNewLine}
          rows={1}
          cols={1}
          type="text"
          className=" w-full sticky bottom-0 rounded-xl py-3 px-5 font-medium text-white caret-white outline-none border-[white]/30 bg-[#282727] text-lg border-2"
        />
      </form>
    </section>
  );
};

export default AI;
