import React, { useEffect, useState } from "react";

const Terminal = ({ code, isWaiting, handleInput }) => {

  console.log(code[0]?.includes('Error'))
  return (
    <section className="px-2 py-1">
      <p className={`${code[0]?.includes('Error')? 'text-red-600': ''}`}>{code}</p>
      <input id="input-box"  style={{resize: 'none'}} className="w-fit border-none outline-none bg-transparent text-lg text-white px-2 py-1" type="text" disabled={!isWaiting}  onKeyUp={handleInput} />
    </section>
  );
};

export default Terminal;
