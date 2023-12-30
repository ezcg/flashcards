import React, { useState } from "react";
import { Navigate } from 'react-router-dom'
import TutorialTopLevel from "./TutorialTopLevel.js"
import Message from "./Message.js"
import TutorialDataService from "../services/TutorialService";
import configs from "../configs";

const AddTutorial = () => {

  const initialTutorialState = {
    id: null,
    title: "",
    description: "",
    published: false,
    subcategory: "",
    categoryId: 0,
    canDrillIt:0
  };
  const [tutorial, setTutorial] = useState(initialTutorialState);
  const [messageObj, setMessageObj] = useState({message:"", success:0, errorObj:{}});

  const handleDrillItChange = event => {
    const { checked } = event.target
    let drillIt = checked ? 1 : 0
    setTutorial({ ...tutorial, canDrillIt: drillIt });
  }

  const handleInputChange = event => {
    let { name, value } = event.target;
    if (name === 'title' && value.length >= configs.maxCharsTitle) {
      value = value.substr(0, configs.maxCharsTitle);
    } else if (name === 'description' && value.length >= configs.maxCharsDescription) {
      value = value.substr(0, configs.maxCharsDescription);
    }
    setTutorial({ ...tutorial, [name]: value });
  };

  const handleCategoryChange = event => {
    const { name, value } = event.target;
    setTutorial({ ...tutorial, [name]: value });
  }

  const saveTutorial = () => {
    var data = {
      title: tutorial.title,
      description: tutorial.description,
      subcategory: tutorial.subcategory,
      categoryId:tutorial.categoryId
    };
    let msg = '';
    if (tutorial.title.length < 3) {
      msg = "Title must be at least 3 characters long. ";
    }
    // if (!tutorial.subcategory) {
    //   msg+= "Category is required. ";
    // }
    if (!tutorial.categoryId) {
      msg+= "Category is required. ";
    }
    if (msg) {
      console.log(tutorial)
      setMessageObj({message:msg, success:0, errorObj: {}});
    } else {
      TutorialDataService.create(data)
        .then(response => {
          setTutorial({
            id: response.data.id,
            title: response.data.title,
            description: response.data.description,
            published: response.data.published
          });
          setMessageObj({message:"", success:1, errorObj:{}});
        })
        .catch(e => {
          setMessageObj({message:"", success:0, errorObj:e});
        });
      }

  };

  if (messageObj.success) {
    return <Navigate to={'/tutorials/' + tutorial.id } />
  }

  return (

    <div className="submit-form">
      <div>

        <TutorialTopLevel
          tutorial={tutorial}
          handleInputChange={handleInputChange}
          handleCategoryChange={handleCategoryChange}
          selectedSubcategory={tutorial.subcategory}
          selectedCategoryId={tutorial.categoryId}
          handleDrillItChange={handleDrillItChange}
        />

        <button onClick={saveTutorial} className="btn btn-success">
          Submit
        </button>

        <br /><br />
        <Message messageObj={messageObj} />

      </div>
    </div>
  );
};

export default AddTutorial;