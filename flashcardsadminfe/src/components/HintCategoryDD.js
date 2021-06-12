import React from 'react';

function HintCategoryDD({handleHintCategoryChange, hintCategoryArr, selectedHintCategory, cardId}) {

    return (
      <div className="form-group">
      <label className="hintCategory" htmlFor="hintCategory">Hint Category:</label>
      <select
        className="hintCategoryDD"
        name="hintCategoryId"
        value={selectedHintCategory}
        onChange={(e) => handleHintCategoryChange(e, cardId)}
      >
      <option value={0}>Select</option>
      {hintCategoryArr.length && hintCategoryArr.map((hintCategoryObj, index) => {
          return <option
            key={index}
            value={hintCategoryObj.id}
          >{hintCategoryObj.hintCategory}</option>
      })}
      </select> <a href="https://flashcards.ezcg.com/hints.html" target="_blank" className="infolink">&#9432;</a>
      </div>
    )

}

export default HintCategoryDD
