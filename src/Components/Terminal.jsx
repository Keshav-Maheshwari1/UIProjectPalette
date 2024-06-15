import React from 'react'

const Terminal = ({code, isWaiting, handlePrompt}) => {
  return (
    <section>
      <p>{code}</p>
    <input type="text" disabled={!isWaiting} onKeyUp={handlePrompt} />
    </section>
  )
}

export default Terminal