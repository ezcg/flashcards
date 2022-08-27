import React from "react";
import CategoryDD from "./CategoryDD.js"
import TitleAndDesc from "./TitleAndDesc.js"

const TutorialTopLevel = ({
  tutorial,
  handleInputChange,
  handleCategoryChange,
  selectedSubcategory,
  selectedCategoryId,
  handleDrillItChange
}) => {

  let checkedValue = tutorial.canDrillIt === 0 ? false : true
  return <div key={selectedSubcategory + "_" + tutorial.canDrillIt}>
    <TitleAndDesc tutorial={tutorial} handleInputChange={handleInputChange}/>
    <div style={{ clear: "both" }}/>
    <br/>
    <div className="form-group">
      Category: <CategoryDD
      handleCategoryChange={handleCategoryChange}
      selectedSubcategory={selectedSubcategory}
      selectedCategoryId={selectedCategoryId}
    />
       &nbsp;
      Can Drill: <input
      type="checkbox"
      name="drillIt"
      value="1"
      checked={checkedValue}
      onChange={handleDrillItChange}
    />
    </div>
  </div>

}

export default TutorialTopLevel