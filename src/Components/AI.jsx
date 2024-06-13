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

    element.textContent += ".";
    if (element.textContent === "....") {
      element.textContent = "";
    }
    loaderInterval = setInterval(() => {}, 300);
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

                <div id=${uniqueId}>${value}</div>
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
    <section className=" w-full bg-gray-500/20 px-4 pt-2 pb-20 overflow-y-auto">
      <div
        id="answer-container"
        className="text-white w-[83%] mx-auto p-5 break-words text-wrap"
      >
        <div id="chat-container"></div>
      </div>
      <form onSubmit={(e) => handleSubmit(e)} onKeyUp={(e) => handleChange(e)}>
        <textarea
          name="prompt"
          placeholder="Ask To AI"
          onKeyDown={handleNewLine}
          rows={1}
          cols={1}
          type="text"
          className=" w-[90%] mt-20 outline-none border-none rounded-xl bg-gray-500/30 px-3 py-[6px] text-lg mx-auto"
        />
      </form>
    </section>
  );
};

export default AI;
