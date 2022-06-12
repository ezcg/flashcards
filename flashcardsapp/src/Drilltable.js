import React, { useState, useContext, useEffect } from 'react'
import { GlobalContext } from './context/GlobalState';
import Drillcard from './Drillcard'
import Drill from './Drill'
import Scoreboard from './Scoreboard'
import configs from "./configs"
import { useParams } from 'react-router-dom'

let drillUtilities = require('./helpers/Drillutilities');

export default function Drilltable () {

  const { tutorialId } = useParams();

  const {
    activeCardsArr,
    setActiveCardsArr,
    wrong,
    setWrong,
    right,
    setRight,
    message,
    setMessage,
    gameover,
    setGameover
  } = useContext(GlobalContext)

  const [deckArr, setDeckArr] = useState([])
  const [displayWrongMark, setDisplayWrongMark] = useState(0)
  const [displayRightMark, setDisplayRightMark] = useState(0)
  const [wrongObj, setWrongObj] = useState({})
  const [isLoaded, setIsLoaded] = useState(0)
  const [numDrilled, setNumDrilled] = useState(0)
  const [isSetDone, setIsSetDone] = useState(0)
  const [flashcardsArr, setFlashcardsArr] = useState([])
  const [totalRight, setTotalRight] = useState(0)

  useEffect(() => {
    if (!isLoaded) {
      let url = configs.s3Url + 'json/' + tutorialId + '.json?cachebuster=' + Math.round((new Date()).getTime() / 1000)
      fetch(url)
        .then(res => res.json())
        .then(
          (result) => {
            //console.log("result", result)
            setFlashcardsArr(result.flashcards)
            let currentDeckArr = drillUtilities.getDrillDeckArr(numDrilled, result.flashcards)
            setDeckArr(currentDeckArr)
            setIsLoaded(1);
          },
          (error) => {
            setIsLoaded(1);
            setMessage(error);
          }
        )
    }
  }, [tutorialId, isLoaded, numDrilled, setMessage, setDeckArr])

  function restart(startOver) {
    let newNumDrilled
    if (startOver) {
      newNumDrilled = 0
      setTotalRight(0)
    } else {
      newNumDrilled = numDrilled + 1
    }
    setNumDrilled(newNumDrilled)
    console.log("restart() startOver:", startOver, "numDrilled:", numDrilled, "newNumDrilled:", newNumDrilled)
    setGameover(0)
    setMessage('')
    setRight(0)
    setWrong(0)
    setWrongObj({})
    setIsSetDone(0)
    let newDeckArr = drillUtilities.getDrillDeckArr(newNumDrilled, flashcardsArr);
    setDeckArr(newDeckArr);
  }

  // Make sure the card clicked on is valid and then evaluate if 2 are currently clicked on
  function mngActiveCards(cardObj) {

    // Prevent clicking on the same card twice
    if (cardObj['clicked'] === 1) {
      cardObj['clicked'] = 0
      let tmpActiveCardsArr = [];
      setActiveCardsArr(tmpActiveCardsArr)
      return
    }
    // Prevent clicking on two of the same kind (eg. question and question, not question and answer)
    if (activeCardsArr.length === 1 && cardObj['is'] === activeCardsArr[0]['is']) {
      return
    }

    // if (activeCardsArr.length === 1 && activeCardsArr[0]['cardId'] === cardObj['cardId'] && activeCardsArr[0]['whatis'] === cardObj['whatis']) {
    //   return;
    // }
    // If any already matched card was clicked on, skip
    if (cardObj['whatis'] === 'done') {
      return;
    }
    // Prevent clicking on a third card while the previous 2 cards are evaluated
    if (activeCardsArr.length === 2) {
      return;
    }
    // If this is the second click, the second card clicked on has not been added to the activeCardsArr yet.
    if (activeCardsArr.length < 2) {
      cardObj['clicked'] = 1
      let tmpActiveCardsArr = [...activeCardsArr, cardObj];
      setActiveCardsArr(tmpActiveCardsArr);
      if (tmpActiveCardsArr.length === 2) {
        setTimeout(evaluatePicks, 700, tmpActiveCardsArr);
      }
    }
  }

  // Evaluate if the 2 cards clicked on match, set score, messaging, set activeCardsArr to empty
  function evaluatePicks(activeCardsArr) {
    if (activeCardsArr[0]['cardId'] === activeCardsArr[1]['cardId']) {
      let currentRight = right + 1
      setRight(currentRight);
      setDisplayRightMark(1)
      setTotalRight(1 + totalRight)
      // set if current set is done
      if (currentRight === deckArr.length/2) {
        setMessage("Well done!");
        setIsSetDone(1);
      }
      // numDrilled starts at 0
      console.log("totalRight", totalRight, "flashcardsArr.length", flashcardsArr.length)
      if (totalRight + 1 === flashcardsArr.length) {
        setGameover(1)
      }
      deckArr.forEach((cardObj, i) => {
        // set the 'checkmark' to be displayed if the cardId and suit between the 2 active cards are the same
        if (cardObj['cardId'] === activeCardsArr[0]['cardId'] && cardObj['whatis'] === activeCardsArr[0]['whatis']) {
           deckArr[i]['done'] = 1;
        } else if (cardObj['cardId'] === activeCardsArr[1]['cardId'] && cardObj['whatis'] === activeCardsArr[1]['whatis']) {
          deckArr[i]['done'] = 1;
        }
      });
    } else {
      setWrong(wrong + 1);
      let tmpWrongObj = JSON.parse(JSON.stringify(wrongObj))
      let tmpActiveCardsObj = JSON.parse(JSON.stringify(activeCardsArr))
      let tmp2WrongObj = {...tmpWrongObj, ...tmpActiveCardsObj}
      setWrongObj(tmp2WrongObj)
      setDisplayWrongMark(1)
    }
    setActiveCardsArr([]);
    deckArr.forEach((cardObj, i) => {
      deckArr[i]['clicked'] = 0
    });
  }

  let wrongMarkStyle = {display:"none"}
  if (displayWrongMark) {
    wrongMarkStyle = {display:"block"}
    setTimeout(() => {setDisplayWrongMark(0)}, 1000)
  }
  let rightMarkStyle = {display:"none"}
  if (displayRightMark) {
    rightMarkStyle = {display:"block"}
    setTimeout(() => {setDisplayRightMark(0)}, 1000)
  }

  let restartBtnStyle = {display:"none"}
  let nextSetBtnStyle = {display:"none"}
  // do drills of questions answered wrong
  if (isSetDone && Object.values(wrongObj).length) {
    // get both q and a that were wrong and make them unique in a final array to pass of to Drill component
    let finalWrongArr = []
    for (let i in wrongObj) {
      let wrongCardId = wrongObj[i].cardId
      let termArr = deckArr.filter((deckObj, i) => {
        return deckObj.cardId === wrongCardId && deckObj.is === 'question'
      })
      let defArr = deckArr.filter((deckObj, i) => {
        return deckObj.cardId === wrongCardId && deckObj.is === 'answer'
      })
      finalWrongArr.push(termArr.pop())
      finalWrongArr.push(defArr.pop())
    }

    return <div className="drillCont">
      <Drill
        wrongArr={finalWrongArr}
        restart={restart}
        gameover={gameover}
      />
    </div>
  }
  if (gameover) {
    restartBtnStyle = { display: "block" }
  } else if (isSetDone) {
    nextSetBtnStyle = {display:"block"}
  }
console.log("gameover",gameover, "totalRight", totalRight, "totalCards", flashcardsArr.length)
  return <div className="tableCont" key={"key_" + activeCardsArr.length + "_" + isSetDone + "_" + gameover}>
    <div className="msg">{message}</div>
    <Scoreboard />
    <div className="wrongMark" style={wrongMarkStyle}>X</div>
    <div className="rightMark" style={rightMarkStyle}>&#10004;</div>
    <div className="restartBtn" style={restartBtnStyle} onClick={() => restart(1)}>Again?</div>
    <div className="restartBtn" style={nextSetBtnStyle} onClick={() => restart()}>Next set</div>
    <div className="cb"></div>
    <br/>
    <div className="cb"></div>
    <br/>
    {deckArr.map((cardObj, i) => {
      let cardStyle = {"display":"block"}
      if (cardObj['done']) {
        cardStyle = {display:"none"}
      }
      return <div style={cardStyle} className="drillCardCont" key={i+ '_' + cardObj['is']} onClick={() => mngActiveCards(cardObj)}>
      <Drillcard cardObj={cardObj} />
      <div className="cb"></div>
      </div>
    })}
    <div style={{clear:'both'}}></div>
  </div>

}
