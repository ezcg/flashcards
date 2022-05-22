import React, { useState, useEffect } from "react";
import TutorialDataService from "../services/TutorialService";
import Card from "./Card";
import Message from "./Message";
import CardBtns from "./CardBtns";
import {
  Link,
  useHistory
} from "react-router-dom";
import TutorialNoEdit from "./TutorialNoEdit";
import AuthService from "../services/auth.service";
import TutorialTopLevel from './TutorialTopLevel'
import configs from '../configs'

const Tutorial = ({props}) => {

  const initialTutorialState = {
    id: null,
    title: "",
    description: "",
    published: false,
    subcategory: "",
    hintCategoryArr:[]
  };

  const history = useHistory();
  const [currentTutorial, setCurrentTutorial] = useState(initialTutorialState);
  const [messageObj, setMessageObj] = useState({message:"", success:0, errorObj:{}});
  const [messageAddCard, setMessageAddCard] = useState("");
  const [messageUpdateCardObj, setMessageUpdateCardObj] = useState({cardId:0, message:"", success:0, errorObj:{}});
  const [cardsArr, setCardsArr] = useState([]);
  const [isTutorialLoading, setIsTutorialLoading] = useState(false);
  const [isTutorialLoaded, setIsTutorialLoaded] = useState(false);
  const [areCardsLoaded, setAreCardsLoaded] = useState(false);
  const [areCardsLoading, setAreCardsLoading] = useState(false);
  const [areHintCategoriesLoading, setAreHintCategoriesLoading] = useState(false);
  const [areHintCategoriesLoaded, setAreHintCategoriesLoaded] = useState(false);
  const [hintCategoryArr, setHintCategoryArr] = useState([]);
  const initialAddCardState = {
    id: currentTutorial.id,
    cardId: null,
    question: "",
    answer: "",
    hint: "",
    hintCategory:0
  };
  const [cardAdd, setCardAdd] = useState(initialAddCardState);

  useEffect(() => {

    const getHintCategoryArr = () => {
      setAreHintCategoriesLoading(true);
      TutorialDataService.getHintCategoryArr()
        .then(response => {
          setAreHintCategoriesLoaded(true);
          setHintCategoryArr(response.data);
        })
        .catch(e => {
          setMessageObj({message:"", success:0, errorObj:e});
        });
    };

    const getTutorial = id => {
      setIsTutorialLoading(true);
      TutorialDataService.get(id)
      .then(response => {
        setCurrentTutorial(response.data);
        setIsTutorialLoaded(true);
      })
      .catch(e => {
        setMessageObj({message:"", success:0, errorObj:e});
      });
    };

    const getCards = id => {
      setAreCardsLoading(true);
      TutorialDataService.getCards(id)
      .then(response => {
        setAreCardsLoaded(true);
        let tmpArr = response.data.reverse()
        setCardsArr(tmpArr);
      })
      .catch(e => {
        setMessageObj({message:"", success:0, errorObj:e});
      });
    };

    if (!areHintCategoriesLoaded && !areHintCategoriesLoading) {
      getHintCategoryArr();
    }

    if (!isTutorialLoaded && !isTutorialLoading) {
      getTutorial(props.computedMatch.params.id);
    }
    if (!areCardsLoaded && !areCardsLoading) {
      getCards(props.computedMatch.params.id);
    }
  }, [props.computedMatch.params.id,
    isTutorialLoaded,
    areCardsLoaded,
    areCardsLoading,
    isTutorialLoading,
    areHintCategoriesLoading,
    areHintCategoriesLoaded
  ]);

  const handleTutorialChange = event => {
    const { name, value } = event.target;
    setCurrentTutorial({ ...currentTutorial, [name]: value });
  };

  const handleCategoryChange = event => {
    const { name, value } = event.target;
    setCurrentTutorial({ ...currentTutorial, [name]: value });
  }

  const handleAddHintCategoryChange = event => {
    const { name, value } = event.target;
    setCardAdd({...cardAdd, [name]: value });
  }

  const handleEditHintCategoryChange = (event, cardId) => {
    const { name, value } = event.target;
    let tmpCardsArr = [...cardsArr];
    tmpCardsArr.forEach((tmpCardObj, index) => {
      if (tmpCardObj.id === cardId) {
        tmpCardsArr[index][name] = value;
      }
    });
    setCardsArr(tmpCardsArr);
  }

  const updateTutorial = () => {
    TutorialDataService.update(currentTutorial.id, currentTutorial)
      .then(response => {
        setMessageObj({message:"The tutorial was updated successfully!", success:1, errorObj:{}});
      })
      .catch(e => {
        setMessageObj({message:"", errorObj:e, success:0});
      });
  };

  const updateTutorialPublishedStatus = status => {
    let data = {
      id: currentTutorial.id,
      published: status
    };

    TutorialDataService.publish(currentTutorial.id, data)
      .then(response => {
        setCurrentTutorial({ ...currentTutorial, published: status });
        setMessageObj({message:response.data.message, success:1, errorObj:{}});
      })
      .catch(e => {
        setMessageObj({message:"", success:0, errorObj:e});
      });
  };

  const deleteTutorial = () => {
    TutorialDataService.deleteTutorial(currentTutorial.id)
    .then(response => {
      setMessageObj({cardId:0, message:response.data.message, success:0, errorObj: {}});
      setTimeout(() => {history.push("/tutorials/my")}, 1000);
    })
    .catch(e => {
      setMessageObj({cardId:0, message:"", success:0, errorObj:e});
    });
  };

  const deleteCard = (event, cardId) => {
    event.preventDefault();
    let params = {tutorialId:currentTutorial.id};
    TutorialDataService.deleteCard(cardId, params)
      .then(response => {
        let tmpCardsArr = [...cardsArr];
        tmpCardsArr.forEach((tmpCardObj, index) => {
          if (tmpCardObj.id === cardId) {
            tmpCardsArr.splice(index, 1);
          }
        });
        setCardsArr(tmpCardsArr);
        setMessageObj({message:response.data.message, success:1, errorObj:{}});
    })
      .catch(e => {
        setMessageUpdateCardObj({cardId: cardId, message:"", success:0, errorObj:e});
      });
  };

  const handleEditCardChange = (event, cardObj) => {
    const { name, value } = event.target;
    let tmpCardsArr = [...cardsArr];
    tmpCardsArr.forEach((tmpCardObj, index) => {
      if (tmpCardObj.id === cardObj.id) {
        tmpCardsArr[index][name] = value;
      }
    });
    setCardsArr(tmpCardsArr);
  };

  const handleAddCardChange = event => {
    const { name, value } = event.target;
    setCardAdd({...cardAdd, [name]: value });
  };

  const addCard = (event) => {
    event.preventDefault();
    let data = {
      id:currentTutorial.id,
      cardId:cardAdd.cardId,
      question: cardAdd.question,
      answer: cardAdd.answer,
      hint: cardAdd.hint,
      hintCategoryId: cardAdd.hintCategoryId
    }

    TutorialDataService.addCard(data)
    .then(response => {
      setMessageAddCard("Added!")
      setCardAdd({question:"", answer:"", hint:"", hintCategoryId:0})
      let tmpCardsArr = [...cardsArr]
      tmpCardsArr.unshift(response.data)
      setCardsArr(tmpCardsArr)
    })
    .catch(e => {
      setMessageObj({message:"", success:0, errorObj:e});
    });
  };

  const updateCard = (event, cardObj) => {
    event.preventDefault();
    let data = {
      id:currentTutorial.id,
      cardId:cardObj.id,
      question: cardObj.question,
      answer: cardObj.answer,
      hintCategoryId: cardObj.hintCategoryId,
      hint: cardObj.hint
    };

    TutorialDataService.updateCard(currentTutorial.id, data)
    .then(response => {
      setMessageUpdateCardObj({cardId:cardObj.id, message:"Updated", success:1, errorObj:{}});
    })
    .catch(e => {
      setMessageUpdateCardObj({cardId:cardObj.id, message:"", success:0, errorObj:e});
    });
  };

  // const updateCardPublishStatus = (event, status, cardId, tutorialId) => {
  //
  //   event.preventDefault();
  //   let data = {
  //     cardId: cardId,
  //     tutorialId: tutorialId,
  //     published: status
  //   };
  //
  //   TutorialDataService.updateCardPublishStatus(tutorialId, data)
  //     .then(() => {
  //       let tmpCardsArr = [...cardsArr];// this is done to trigger a re-render
  //       tmpCardsArr.forEach((tmpCardObj, index) => {
  //         if (tmpCardObj.id === cardId) {
  //           tmpCardsArr[index].published = status;
  //         }
  //       });
  //       setCardsArr(tmpCardsArr);
  //       setMessageUpdateCardObj({cardId: cardId, message:"Updated card publish status", success:1, errorObj: {}});
  //     })
  //     .catch(e => {
  //       setMessageUpdateCardObj({cardId: cardId, message:"", success:0, errorObj:e});
  //     });
  // };
  const currentUser = AuthService.getCurrentUser();
  let isModerator = currentUser.roles.includes("ROLE_MODERATOR") || currentUser.roles.includes("ROLE_ADMIN");

  if (!isTutorialLoaded || !areCardsLoaded) {
    return null;
  } else if (!isModerator && currentTutorial.published === 2) {
    return (<TutorialNoEdit tutorial={currentTutorial} cardsArr={cardsArr} />)
  } else {

    return (

      <div>

        {!currentTutorial.id
          ? (<div><Message messageObj={messageObj} /></div>)
          : (

        <>
        <div>
          <form>

            <TutorialTopLevel
              tutorial={currentTutorial}
              handleInputChange={handleTutorialChange}
              handleCategoryChange={handleCategoryChange}
              selectedSubcategory={currentTutorial.subcategory}
            />

            <b>Tutorial Publish Status:</b> {currentTutorial.published ? "Published" : "Not published"}
            &nbsp;
            | <b># Flashcards:</b> {cardsArr.length} (Max {configs.maxQuestions})
          </form>

          {currentTutorial.published ? (
            <button
              className="btn btn-primary btnmore"
              onClick={() => updateTutorialPublishedStatus(false)}
            >
              Unpublish
            </button>
          ) : (
            <>
            <button
              type="submit"
              className="btn btn-info btnmore"
              onClick={updateTutorial}
            >
              Update
            </button>

            <button
              className="btn btn-primary"
              onClick={() => updateTutorialPublishedStatus(true)}
            >
              Publish
            </button>

            <Link to={"/order/" + currentTutorial.id}>
            <button className="btn btn-info btnmore">
            Set Order of Flashcards
            </button>
            </Link>
            </>
          )}

          <button
            className="btn btn-danger btnmore"
            onClick={(e) => { window.confirm('Are you sure you wish to delete this tutorial?') && deleteTutorial() }}
          >
            Delete
          </button>

          <div style={{clear:"both"}} />
          <br />
          <Message messageObj={messageObj} />

          {currentTutorial.published ? (
            <div className="updatePublishNotice">To edit anything about this tutorial, you must first hit the Unpublish button
              above. When done editing, hit the Publish button and then go to Moderate Undistributed and Distribute.</div>
          ) : ("")
          }

        </div>

        {/*ADD CARD */}

        <div>
          <span className="addLabel">Add Flashcard</span>
          <br />
          {cardsArr.length >= configs.maxQuestions ? (
            <div className="maxFlashcardsMsg">You've made {configs.maxQuestions} flashcards which is the maximum number of flashcards you can
              have per tutorial. Well done!</div>
          ) : (currentTutorial.published && cardsArr.length < configs.maxQuestions ? (
            <div className="addFlashcardsUnpublishNotice">You must hit the Unpublish button above before you can add
              more flashcards to this tutorial. Once you're done adding cards, you Publish it again.</div>
            ) : (
            <form>
            <Card
              handleCardChange={handleAddCardChange}
              question={cardAdd.question}
              answer={cardAdd.answer}
              handleHintCategoryChange={handleAddHintCategoryChange}
              hintCategoryArr={hintCategoryArr}
              selectedHintCategory={""}
              cardId={0}
              cardObj={{}}
              hintText={cardAdd.hint}
            />

            <div style={{clear:"both"}} />

            <button className="btn btn-primary" onClick={addCard}>
              Add
            </button>
            <div style={{clear:"both"}} />
            <br />
            <Message messageObj={messageAddCard} />

            </form>
          ))}
        </div>

       {/*EDIT CARD */}

      <div>
        <span className="editLabel">Edit Flashcards</span>
        <br />
        {cardsArr &&
        cardsArr.map((cardObj, index) => (
          <div key={cardObj.id}>
          <form>

            <label className="questionEditLabel" htmlFor="questionEdit">{cardsArr.length - index}.) Question:</label>
            <Card
              handleCardChange={(event) => handleEditCardChange(event, cardObj)}
              question={cardObj.question}
              answer={cardObj.answer}
              handleHintCategoryChange={handleEditHintCategoryChange}
              hintCategoryArr={hintCategoryArr}
              selectedHintCategory={cardObj.hintCategoryId}
              cardId={cardObj.id}
              cardObj={cardObj}
              hintText={cardObj.hint}
            />

            <div style={{clear:"both"}} />

            {currentTutorial.published ? (
              <div className="updateCardPublishNotice">
                To edit cards, you must first hit the Unpublish button above. When you're done editing, hit Publish again.
              </div>
            ) : (
              <CardBtns
                updateCard={updateCard}
                cardObj={cardObj}
                deleteCard={deleteCard}
                // updateCardPublishStatus={updateCardPublishStatus}
              />
            )}
            <Message messageObj={messageUpdateCardObj} cardId={cardObj.id} />
            <hr />
          </form>
          </div>
        ))}

      </div>
      </>

      )}

      </div>

    );
  }
};

export default Tutorial;
