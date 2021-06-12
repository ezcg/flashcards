/** @jsx jsx */
import { useState, useEffect } from 'react'
import { jsx } from '@emotion/core'
import Card from './Card'
import Buttons from './Buttons'
import configs from "./configs"
import { useParams, Link } from "react-router-dom";
import {homeIcon} from "./HomeIcon"

const Cards = () => {

  const { tutorialId } = useParams();
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [cardArr, setCardArr] = useState([])
  const [tutorialObj, setTutorialObj] = useState({})
  const [cardNum, setCardNum] = useState(0);
  const [view, setView] = useState('q');
  const [viewHintBool, setViewHintBool] = useState(false);

  useEffect(() => {
    if (!isLoaded) {
      let url = configs.s3Url + 'json/' + tutorialId + '.json';
      fetch(url)
        .then(res => res.json())
        .then(
          (result) => {
            setTutorialObj(result);
            setCardArr(result.flashcards);
            setIsLoaded(true);
          },
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        )
    }
  }, [tutorialId, isLoaded])

  const nextCard = function() {
    let tmpCardNum = (cardNum + 1 === cardArr.length) ? 0 : cardNum + 1;
    setCardNum(tmpCardNum)
    setView('q')
  }

  const prevCard = function() {
    let tmpCardNum = (cardNum - 1 > 0) ? cardNum - 1 : cardArr.length - 1;
    setCardNum(tmpCardNum)
    setView('q')
  }

  const clickView = function() {
    if (view === 'a') {
      setView('q')
    } else if (view === 'q') {
      setView('a');
    }
  }

  const handleViewHint = function() {
    if (viewHintBool) {
      setViewHintBool(false);
    } else {
      setViewHintBool(true);
      setView('q')
    }
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return null
  } else {

    return (

      <div key="main" className="cardCont">
        <div className="header">
          <Link to="/">
            <img className='homeIcon' src={homeIcon} alt="Home" />
          </Link>
          <div className="tutorialCategory"> {tutorialObj.subcategory}: &nbsp;{tutorialObj.title}</div>
          <span>On Question #: {cardNum + 1} of {cardArr.length}</span>
        </div>
        {cardArr.map((cardObj, i) => (
          i === cardNum ? (
            <div key={"key_" + i}>
            <Card key={cardObj.question + "_" + i}
              cardObj={cardObj}
              view={view}
              viewHintBool={viewHintBool}
            />
            <Buttons
              view={view}
              clickView={clickView}
              nextCard={nextCard}
              prevCard={prevCard}
              handleViewHint={handleViewHint}
              viewHintBool={viewHintBool}
              hasHintBool={cardObj.hintCategory !== 'undefined' && cardObj.hintCategory !== '' ? true : false}
            />
            </div>
          ) :
            ("")
        ))}

      </div>

    )
  }
}

export default Cards
