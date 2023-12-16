import Arrow from "./Arrow";

export default function Buttons ({ view, clickView, prevCard, nextCard, handleViewHint, viewHintBool, hasHintBool }) {
  let buttonHintClass = "buttonHint";
  // let answerBg = "#ffffff";
  // let questionBg = "#ffffff";
  // let hintBg = "#ffffff";
  let answerBtnText = 'A';
  let disableHintBtn = false
  if (hasHintBool === false) {
    disableHintBtn = true;
  }
  // turn off all other buttons when viewing hint
  let disableNonHintBtn = false
  if (viewHintBool) {
    // questionBg = '#ffffff';
    // hintBg = '#cccccc';
    //disableNonHintBtn = true
  } else if (view === 'q') {
    // questionBg = '#cccccc';
  } else if (view === 'a') {
    // If the 'Answer' but is clicked on, replace the Answer button with a Next button for ease of navigation
    // answerBg = '#cccccc';
    answerBtnText = 'Next &raquo;';
  }

  return <div className="buttonsCont" key={view}>

  <Arrow
    direction="left"
    handleClick={prevCard}
    disableBtn={disableNonHintBtn}
  />

  {/*question   */}
  <button
    className="button"
    onClick={() => clickView(view, 'q')}
    disabled={disableNonHintBtn}
  >
  Q
  </button>

  {/*answer  */}
  <button
    className="button"
    onClick={() => clickView(view, 'a')}
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
  ><a rel="noopener noreferrer" href="https://flashcards.full-stack-dev.net/hints.html" target="_blank"
  ><b>About Hints</b></a>
  </div>
  </div>

}
