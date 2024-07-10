import React from 'react'

const Footer = ({terminals, terminalComponents, terminal, setTerminal, handleSubmit}) => {
  return (
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
  )
}

export default Footer