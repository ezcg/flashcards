import React from "react";
import CharCounter from './CharCounter'
import configs from '../configs'
import HintCategoryDD from './HintCategoryDD'

const Card = ({handleCardChange, question, answer, handleHintCategoryChange, hintCategoryArr, selectedHintCategory, cardId, cardObj, hintText}) => {

  return <div key={cardId}>
    <div className="form-group">
    <label className="questionLabel" htmlFor="question">Question:</label>
    <textarea
      rows="4"
      cols="100"
      className="questionField"
      id="question"
      name="question"
      onChange={handleCardChange}
      value={question}
    />
    <CharCounter maxChars={configs.maxCharsQuestion} chars={question} />

  </div>

  <div style={{clear:"both"}} />

  <div className="form-group">
    <label className="questionLabel" htmlFor="question">Answer:</label>
    <textarea
      rows="4"
      cols="100"
      className="answerField"
      id="answer"
      name="answer"
      onChange={handleCardChange}
      value={answer}
    />
    <CharCounter maxChars={configs.maxCharsAnswer} chars={answer} />

  </div>

  <div style={{clear:"both"}} />

  <HintCategoryDD
    handleHintCategoryChange={handleHintCategoryChange}
    hintCategoryArr={hintCategoryArr}
    selectedHintCategory={selectedHintCategory}
    cardId={cardId}
  />

  <div className="form-group hintCont">
    <label className="hintLabel" htmlFor="hintField">Hint:</label>
    <input
      type="text"
      className="hintText"
      id="hintField"
      value={hintText}
      onChange={handleCardChange}
      name="hint"
    />
    <CharCounter maxChars={configs.maxCharsHint} chars={hintText} />
  </div>

</div>

}

export default Card;