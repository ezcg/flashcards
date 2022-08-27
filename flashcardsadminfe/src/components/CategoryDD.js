import React, { useState } from 'react';
import TutorialDataService from "../services/TutorialService";

function CategoryDD({handleCategoryChange, selectedSubcategory, selectedCategoryId}) {
console.log("selectedCategoryId", selectedCategoryId)
  const [categoryObj, setCategoryObj] = useState({});
  const [areCategoriesLoaded, setAreCategoriesLoaded] = useState(false);

  React.useEffect(() => {

    const getCategoryArr = () => {
      TutorialDataService.getCategories()
      .then(response => {
        console.log(response.data)
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
        name="categoryId"
        value={selectedCategoryId}
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
            value={childObj.id}
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
