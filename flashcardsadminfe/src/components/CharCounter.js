import React from 'react';

export default function CharCounter({maxChars, chars}) {
  let charStyle = {color:"#6c757d"}
  let charsLength = !chars ? 0 : chars.length;
  let numCharsRemaining = maxChars - charsLength;
  if (numCharsRemaining <= 0) {
    charStyle = {color:"red"}
  }
  return <div className="charCounterCont">
   <span className="charCounter" style={charStyle}>{numCharsRemaining}</span>
  </div>
}


