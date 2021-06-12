/** @jsx jsx */

import { css, jsx } from '@emotion/core'
import Arrow from "./Arrow";

export default function Buttons ({ view, clickView, prevCard, nextCard, handleViewHint, viewHintBool, hasHintBool }) {

  let buttonHintClass = "buttonHint";
  let answerBg = "#ffffff";
  let questionBg = "#ffffff";
  let hintBg = "#ffffff";
  let answerBtnText = 'A';
  let answerHandler = clickView;
  // if there is no hint, disable hint button
  let disableHintBtn = false
  if (hasHintBool === false) {
    disableHintBtn = true;
  }
  // turn off all other buttons when viewing hint
  let disableNonHintBtn = false
  if (viewHintBool) {
    questionBg = '#ffffff';
    hintBg = '#cccccc';
    disableNonHintBtn = true
  } else if (view === 'q') {
    questionBg = '#cccccc';
  } else if (view === 'a') {
    // If the 'Answer' but is clicked on, replace the Answer button with a Next button for ease of navigation
    answerBg = '#cccccc';
    answerBtnText = 'Next &raquo;';
    answerHandler = nextCard;
  }

  return <div className="buttonsCont">

  <Arrow
    direction="left"
    handleClick={prevCard}
    disableBtn={disableNonHintBtn}
  />

  {/*question   */}
  <button
    className="button"
    onClick={clickView}
    css={css`background-color:${questionBg}`}
    disabled={disableNonHintBtn}
  >
  Q
  </button>

  {/*answer  */}
  <button
    className="button"
    onClick={answerHandler}
    css={css`background-color:${answerBg}`}
    disabled={disableNonHintBtn}
  >
    {/*Dynamic display of button label with either 'Answer' or 'Next'*/}
    <div
      dangerouslySetInnerHTML={{ __html: answerBtnText }}
    />
  </button>
  {/*hint*/}
  <button
    disabled={disableHintBtn}
    className={buttonHintClass}
    onClick={() => handleViewHint(true)}
    css={css`background-color:${hintBg}`}
  >
    Hint
  </button>
  <Arrow
    direction="right"
    handleClick={nextCard}
    disableBtn={disableNonHintBtn}
  />
  <div style={{clear:"both"}} />
  <div className="aboutHintsLinkCont"
  ><a rel="noopener noreferrer" href="https://flashcards.ezcg.com/hints.html" target="_blank"
  ><b>About Hints</b></a>
  </div>
  </div>

}
