/** @jsx jsx */
import { useState, useEffect } from 'react'
import { css, jsx } from '@emotion/core'
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

  useEffect(() => {
    if (!isLoaded) {
      fetch(configs.s3Url + 'json/' + tutorialId + '.json')
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
    let tmpCardNum = cardNum - 1 > 0 ? cardNum - 1 : 0;
    setCardNum(tmpCardNum)
    setView('q')
  }

  const clickView = function() {
    if (view === 'q') {
      setView('a');
    } else {
      setView('q');
    }
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return null
  } else {

    return (

      <div key="main" className="cardCont">
        <div css={headerCSS}>
          <Link to="/">
            <img className='homeIcon' src={homeIcon} alt="Home" />
          </Link>
          <div css={tutorialCategoryCSS}> {tutorialObj.subcategory}: &nbsp;{tutorialObj.title}</div>

          <span>On Question #: {cardNum + 1} of {cardArr.length}</span>
        </div>
        {cardArr.map((cardObj, i) => (
          i === cardNum ? (
          <Card key={cardObj.question + "_" + i}
            cardNum={cardNum}
            cardObj={cardObj}
            view={view}
          />
          ) :
            ("")
        ))}

        <Buttons
          view={view}
          clickView={clickView}
          nextCard={nextCard}
          prevCard={prevCard}
        />

      </div>

    )
  }
}

const tutorialCategoryCSS = css`
  font-weight:bold;
`

const headerCSS = css`
  margin:10px;
`

export default Cards
