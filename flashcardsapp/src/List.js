import React, { useState, useEffect } from 'react'
import ListRow from './ListRow'
import configs from "./configs"
import { useParams } from "react-router-dom";

const List = () => {

  let { subcategory, categoryId } = useParams();
  categoryId = parseInt(categoryId)
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [tutorialsArr, setTutorialsArr] = useState([])

  useEffect(() => {
    if (!isLoaded) {
      let url = configs.s3Url + 'json/list.json'
      // if ((window.location.host).indexOf("localhost") !== -1) {
      //   url = 'http://localhost:8080/api/tutorials/getlistoftutorials'
      // }
      console.log("<List>",url)
      fetch( url)
      .then(res => res.json())
      .then(
        (result) => {
          let tmpTutorialsArr = result.filter(obj => { return obj.categoryId === categoryId })
          setTutorialsArr(tmpTutorialsArr);
          setIsLoaded(true);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
    }
  }, [isLoaded, categoryId]);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return null;
  } else {
    return (
      <div key="main" className="container">
        <div className='categoryHeader'>{subcategory}</div>
        {tutorialsArr.map((obj, i) => {
          let displayCategoryHeaderBool = false;
          return <ListRow
            displayCategoryHeaderBool={displayCategoryHeaderBool}
            key={i.toString()}
            tutorialObj={obj}
          />
        })}
      </div>
    )
  }
}

export default List;
