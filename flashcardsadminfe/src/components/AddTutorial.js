import React, { useState } from "react";
import CategoryDD from "./CategoryDD.js"
import Message from "./Message.js"
import TitleAndDesc from "./TitleAndDesc.js"
import TutorialDataService from "../services/TutorialService";
import  { Redirect } from 'react-router-dom'
import configs from "../configs";

const AddTutorial = () => {

  const initialTutorialState = {
    id: null,
    title: "",
    description: "",
    published: false,
    subcategory: ""
  };
  const [tutorial, setTutorial] = useState(initialTutorialState);
  const [messageObj, setMessageObj] = useState({message:"", success:0, errorObj:{}});

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
      subcategory: tutorial.subcategory
    };
    let msg = '';
    if (tutorial.title.length < 3) {
      msg = "Title must be at least 3 characters long. ";
    }
    if (!tutorial.subcategory) {
      msg+= "Category is required. ";
    }

    if (msg) {
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
    return <Redirect
      to={{
        pathname:'/tutorials/' + tutorial.id,
      }} />
  }

  return (

    <div className="submit-form">
      <div>

        <TitleAndDesc tutorial={tutorial} handleInputChange={handleInputChange} />

        <div style={{clear:"both"}} />
        <br />

        <div className="form-group">
          Category: <CategoryDD handleCategoryChange={handleCategoryChange} />
        </div>

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