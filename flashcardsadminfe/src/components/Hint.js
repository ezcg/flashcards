import CharCounter
  from "./CharCounter";
import React
  from "react";
import configs from '../configs'

export default function Hint({hint, handleInputChange, cardObj}) {

  return <div className="form-group hintCont">
      <label className="hintLabel" htmlFor="hintAdd">Hint:</label>
      <input
        type="text"
        className="hintText"
        id="hintAdd"
        value={hint}
        onChange={(e) => handleInputChange(e, cardObj)}
        name="hint"
      />
      <CharCounter maxChars={configs.maxCharsHint} chars={hint} />
  </div>

}
