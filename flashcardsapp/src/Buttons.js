/** @jsx jsx */

import { css, jsx } from '@emotion/core'
import Arrow from "./Arrow";

export default function Buttons ({ view, clickView, prevCard, nextCard }) {

  let answerBg = "#ffffff";
  let questionBg = "#ffffff";
  let answerText = 'Answer';
  let answerHandler = clickView;
  if (view === 'q') {
    questionBg = '#cccccc';
  } else if (view === 'a') {
    answerBg = '#cccccc';
    answerText = 'Next &raquo;';
    answerHandler = nextCard;
  }

  return <div className="buttonsCont">
  <Arrow direction="left" handleClick={prevCard} />
  <div
    className="button"
    onClick={clickView}
    css={css`background-color:${questionBg}`}
  >
  Question
  </div>
  <div
    className="button"
    onClick={answerHandler}
    css={css`background-color:${answerBg}`}
  >
  <div dangerouslySetInnerHTML={{ __html: answerText }} />
  </div>
  <Arrow direction="right" handleClick={nextCard} />
  <div style={{clear:"both"}} />
  </div>

}
