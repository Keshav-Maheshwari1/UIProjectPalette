import React, { useEffect, useState } from "react";

const Terminal = ({ code, isWaiting, handlePrompt, inputPrompt }) => {
  const [output,setOuput] = useState('')

  useEffect(() => {
    if (inputPrompt !== '' && isWaiting) {
      console.log("Entered")
      setOuput(inputPrompt);
    }
  }, [inputPrompt]);
  return (
    <section>
      <p>{code}</p>
      <input type="text" disabled={!isWaiting}  onKeyUp={handlePrompt} />
    </section>
  );
};

export default Terminal;
