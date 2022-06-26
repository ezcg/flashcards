import React, { useState, useEffect } from 'react'
import configs from "./configs"
import { Link } from "react-router-dom";

export default function Categories() {

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [categoryArr, setCategoryArr] = useState([])
  const [subcategoryArr, setSubcategoryArr] = useState([])

  useEffect(() => {
    if (!isLoaded) {
      console.log("asdf",window.location.host)
      let url = configs.s3Url + 'json/categories.json'
      if ((window.location.host).indexOf("localhost") !== -1) {
        url = 'http://localhost:8080/api/tutorials/getcategoriesjson'
      }
      console.log(url)
      fetch(url)
      .then(res => res.json())
      .then(
        (result) => {
          let tmpCategoryArr =  Object.keys(result);
          let tmpSubcategoryArr = Object.values(result);
          setCategoryArr(tmpCategoryArr);
          setSubcategoryArr(tmpSubcategoryArr);
          setIsLoaded(true);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
    }
  });

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return null;
  } else {

    return (
      <div key="main" className="container">
        <div className="categoriesHeader">
          <span className="categoriesTitle">Flashcards by ezcg.com</span>
          {/*<br />*/}
          {/*<a className='linkToAdmin' href={configs.flashcardsadminfe}>Create and edit your own flashcard set</a> or click on a set below to practice.*/}
        </div>
        {categoryArr.map((category, i) => {
          return <div key={category}><div className="categoryHeader">{category}</div>
            {subcategoryArr[i] && (subcategoryArr[i].map((subcategory, j) => {
              return <div className="subcategoryLinkCont" key={subcategory}>
                <Link
                  to={"/list/" + subcategory}
                  className="subcategoryLink"
                >{subcategory}
                </Link>
                <div className="cb"></div>
              </div>
            }))}
          </div>
        })}
      </div>
    )
  }
}
