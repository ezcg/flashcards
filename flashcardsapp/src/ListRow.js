import React from 'react'
import configs from "./configs"

const ListRow = ({tutorialObj}) => {

  return (

    <div key={tutorialObj.title}>
      <div className="listRow">
        <div className="tutorialTitle">{tutorialObj.title}</div> by
        <div className="tutorialUsername"> {tutorialObj.username} ({tutorialObj.numCards} Cards)</div>
        <div className="tutorialDescription">{tutorialObj.description}</div>
        <div className="takeItBtnCont">
        <a
          rel="noopener noreferrer"
          href={configs.url + tutorialObj.tutorialId.toString()}
        >
          <div className="btn btn-info">
          <span className="takeItBtn">Take it &raquo;</span>
          </div>
        </a>
        </div>
      </div>
    </div>

  )
}

export default ListRow
