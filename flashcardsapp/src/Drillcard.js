import React from 'react'

export default function Drillcard ({cardObj}) {

  let displayCard = cardObj['whatis']
  let cardStyle = {"backgroundColor":"lightblue"}
  if (cardObj['is'] === 'question') {
    cardStyle = {'backgroundColor':'#cccccc'}
  }
  let checkmarkStyle = {display:"none"}
  if (cardObj['clicked']) {
    checkmarkStyle = {display:"block"}
  }

  return <div key={`card ${cardObj['rank']}_${cardObj['whatis']}`} className={`drillCard`} style={cardStyle}>
    <div dangerouslySetInnerHTML={{ __html: displayCard}} />
    <div className="cb"></div>
    <span style={checkmarkStyle} className="drillCheckmark">&#10004;</span>
  </div>

}
