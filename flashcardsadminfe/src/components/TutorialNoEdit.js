import React from 'react';

const TutorialNoEdit = ({tutorial, cardsArr}) => {

  return (
      <div>
      <div className="noticeNoEdit">This tutorial has been distributed and you cannot edit it any further. </div>
        <br />
      <div><span className="titleNoEdit">{tutorial.title}</span> in <span className="categoryNoEdit">{tutorial.subcategory}</span></div>
      <div className="description">{tutorial.description}</div>
        <br />
      {cardsArr.map((cardObj, index) => (
        <div key={cardObj.id}>
          <div className="questionNoEdit">Q: {cardObj.question}</div>
          <div className="answerNoEdit">A: {cardObj.answer}</div>
          <hr />
        </div>
      ))}
      </div>
  )

}

export default TutorialNoEdit;
