import React from "react";
import CategoryDD from "./CategoryDD.js"
import TitleAndDesc from "./TitleAndDesc.js"

const TutorialTopLevel = ({tutorial, handleInputChange, handleCategoryChange, selectedSubcategory}) => {

  return <div key={selectedSubcategory}>
    <TitleAndDesc tutorial={tutorial} handleInputChange={handleInputChange}/>

    <div style={{ clear: "both" }}/>
    <br/>

    <div className="form-group">
      Category: <CategoryDD handleCategoryChange={handleCategoryChange} selectedSubcategory={selectedSubcategory}/>
    </div>
  </div>

}

export default TutorialTopLevel;