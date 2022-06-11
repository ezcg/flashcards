import React from 'react'

const ListRow = ({tutorialObj}) => {

  return (

    <div key={tutorialObj.title}>
      <div className="listRow">
        <div className="tutorialTitle">{tutorialObj.title}</div> by
        <div className="tutorialUsername"> {tutorialObj.username} ({tutorialObj.numCards} Cards)</div>
        <div className="tutorialDescription">{tutorialObj.description}</div>
        <div className="takeItBtnCont">
          <a
            className="takeItLink"
            rel="noopener noreferrer"
            href={"/" + tutorialObj.tutorialId.toString()}
          >
            <div className="">
              <span className="takeItBtn">Take it &raquo;</span>
            </div>
          </a>
        </div>
        {tutorialObj.canDrillIt !== 0 &&
          <div className="drillItBtnCont">
            <a
              className="drillItLink"
              rel="noopener noreferrer"
              href={"/drilltable/" + tutorialObj.tutorialId.toString()}
            >
              <div className="">
                <span className="takeItBtn">Drill it &raquo;</span>
              </div>
            </a>
          </div>
        }
      </div>
      <hr/>
    </div>

  )
}

export default ListRow
