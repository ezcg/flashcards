import React from 'react';

function CardBtns({updateCard, cardObj, deleteCard}) {
  return <div >
    <button className="btn btn-info" onClick={(event) => updateCard(event, cardObj)}>
      Update Card
    </button>

    {/*{cardObj.published ? (*/}
    {/*  <button*/}
    {/*    className="btn btn-primary btnmore"*/}
    {/*    onClick={(event) => updateCardPublishStatus(event, false, cardObj.id, cardObj.tutorialId)}*/}
    {/*  >*/}
    {/*    UnPublish Card*/}
    {/*  </button>*/}
    {/*) : (*/}
    {/*  <button*/}
    {/*    className="btn btn-primary btnmore"*/}
    {/*    onClick={(event) => updateCardPublishStatus(event, true, cardObj.id, cardObj.tutorialId)}*/}
    {/*  >*/}
    {/*    Publish Card*/}
    {/*  </button>*/}
    {/*)}*/}

    <button
      className="btn btn-danger btnmore"
      onClick={(e) => {
        if (window.confirm('Are you sure you wish to delete this card?')) {
          deleteCard(e, cardObj.id)
        } else {
          e.preventDefault()
        }
      }}
    >
      Delete Card
    </button>

  </div>
}

export default CardBtns
