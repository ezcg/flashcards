/** @jsx jsx */
import { css, jsx } from '@emotion/core'

export default function Card ({ cardObj, view }) {

  if (!cardObj) {
    return null
  }
  return <div className="card"
    css={css`
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      border:1px solid black;
      margin:10px;
      padding:10px;
    `}
  >{view === 'q' ? (<pre>Q: {cardObj.question}</pre>) : (<pre>{cardObj.answer}</pre>)}<div style={{clear:"both"}}></div></div>
}

