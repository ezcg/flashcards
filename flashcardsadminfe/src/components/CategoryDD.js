import React, { useState } from 'react';
import TutorialDataService from "../services/TutorialService";

function CategoryDD({handleCategoryChange, selectedSubcategory}) {

  const [categoryArr, setCategoryArr] = useState([]);
  const [subcategoryArr, setSubcategoryArr] = useState([]);
  const [areCategoriesLoaded, setAreCategoriesLoaded] = useState(false);

  React.useEffect(() => {

    const getCategoryArr = () => {
      TutorialDataService.getCategoryArr()
      .then(response => {
        let tmpCategoryArr =  Object.keys(response.data);
        let tmpSubcategoryArr = Object.values(response.data);
        setCategoryArr(tmpCategoryArr);
        setSubcategoryArr(tmpSubcategoryArr);
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
        {categoryArr.length && categoryArr.map((categoryTopLevel, index, categoryArr) => {
          return <React.Fragment key={categoryTopLevel}><optgroup label={categoryTopLevel}
            key={index}
            className="categoryTopLevelSelectName"
          >
          {subcategoryArr[index] && (subcategoryArr[index].map((subcategory, index) => {
            return <option
            key={subcategory}
            value={subcategory}
            > &nbsp; {subcategory}</option>
          }))}
          </optgroup>
          </React.Fragment>
        })}
      </select>
    )
  }
}

export default CategoryDD
