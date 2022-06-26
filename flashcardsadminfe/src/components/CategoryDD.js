import React, { useState } from 'react';
import TutorialDataService from "../services/TutorialService";

function CategoryDD({handleCategoryChange, selectedSubcategory}) {

  const [categoryObj, setCategoryObj] = useState({});
  const [areCategoriesLoaded, setAreCategoriesLoaded] = useState(false);

  React.useEffect(() => {

    const getCategoryArr = () => {
      TutorialDataService.getCategories()
      .then(response => {
        setCategoryObj(response.data)
        setAreCategoriesLoaded(true);
      }).catch(e => {
        console.log("e", e);
      });
    }
    if (!areCategoriesLoaded) {
      getCategoryArr();
    }
  }, [areCategoriesLoaded]);

  if (!areCategoriesLoaded) {
    return null;
  } else {
    return (
      <select
        name="subcategory"
        value={selectedSubcategory}
        onChange={(e) => handleCategoryChange(e)}
      >
        <option defaultValue>Select</option>
        {Object.keys(categoryObj).length && Object.values(categoryObj).map((obj, index) => {
          let categoryTopLevel = obj.category
          return <React.Fragment key={categoryTopLevel}><optgroup label={categoryTopLevel}
            key={index}
            className="categoryTopLevelSelectName"
          >
          {obj.childArr.length && obj.childArr.map((childObj, index) => {
            return <option
            key={childObj.category}
            value={childObj.category}
            > &nbsp; {childObj.category}</option>
          })}
          </optgroup>
          </React.Fragment>
        })}
      </select>
    )
  }
}

export default CategoryDD
