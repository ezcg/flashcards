import React, { useState } from 'react'

export default function Drill ({wrongArr, restart, gameover}) {

  let [view, setView] = useState('term')
  let [currentCard, setCurrentCard] = useState(0)
  let [clickNum, setClickNum] = useState(0)

  let wrongTermObj = wrongArr[currentCard]
  let wrongDefObj = wrongArr[currentCard + 1]
  let doDrill = 1

  function next() {
    let nextCard = currentCard + 2
    if (clickNum > 4) {
      setClickNum(0)
      setCurrentCard(nextCard)
      setView("term")
    } else {
      setClickNum(++clickNum)
      if (view === 'term') {
        setView("def")
      } else {
        setView("term")
      }
    }
  }
  let text
  if (currentCard + 2 > wrongArr.length) {
    doDrill = 0
  } else {
    text = wrongTermObj.whatis
    if (view !== 'term') {
      text = wrongDefObj.whatis
    }
  }

  let restartBtnStyle = !doDrill ? {display:'block'} : {display:'none'};
  let drillCardStyle = doDrill ? {display:'block'} : {display:"none"}
  let startOver = gameover ? 1 : 0
  let nextBtnText = gameover ? "Begin again?" : "Next Set"

  return <div>
    <button className='restartBtn' style={restartBtnStyle} onClick={() => restart(startOver)}>{nextBtnText}</button>
    <div style={drillCardStyle} key={`card_${currentCard}_${view}`} className={`drillCard`} onClick = {() => next()}>
    <div dangerouslySetInnerHTML={{ __html: text}} />
    <span className="nextLink">&raquo;</span>
    <div className="cb"></div>
  </div>
  </div>

}