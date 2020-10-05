import TutorialDataService from "../services/TutorialService";
import Message from "./Message";
import {Link} from "react-router-dom";
import React, {useState, useCallback, useEffect} from 'react';
import styled from 'styled-components';
import {range, inRange} from 'lodash';
import Draggable from './Draggable';

// For drag and drop
const MAX = 20;
const HEIGHT = 80;

const Order = ({props}) => {

  const initialTutorialState = {
    id: null,
    title: "",
    description: "",
    published: false,
    subcategory: ""
  };

  const [orderContainerStyle, setOrderContainerStyle] = useState({});
  const [currentTutorial, setCurrentTutorial] = useState(initialTutorialState);
  const [messageObj, setMessageObj] = useState({message:"", success:0, errorObj:{}});
  const [cardsArr, setCardsArr] = useState([]);
  const [isTutorialLoaded, setIsTutorialLoaded] = useState(false);
  const [areCardsLoaded, setAreCardsLoaded] = useState(false);

  useEffect(() => {
    const getTutorial = id => {
      TutorialDataService.get(id)
      .then(response => {
        if (response.data.published === true) {
          setMessageObj({message:"You must first Unpublish the tutorial before setting the display order of the flashcards. Go back to Edit to Unpublish the tutorial.", success:0, errorObj:{}});
        }
        setCurrentTutorial(response.data);
        setIsTutorialLoaded(true);
      })
      .catch(e => {
        setMessageObj({message:"", success:0, errorObj:e});
      });
    }
    const getCards = id => {
      TutorialDataService.getCards(id)
      .then(response => {
        setCardsArr(response.data);
        setAreCardsLoaded(true);
        let obj = {height: (HEIGHT * response.data.length + 600) + "px"};
        setOrderContainerStyle(obj);
        })
      .catch(e => {
        setMessageObj({message:"", success:0, errorObj:e});
      });
    }
    if (!isTutorialLoaded) {
      getTutorial(props.computedMatch.params.id);
    }
    if (!areCardsLoaded) {
      getCards(props.computedMatch.params.id);
    }
  }, [props.computedMatch.params.id, isTutorialLoaded, areCardsLoaded]);

  const saveOrder = () => {
    let rankIdArr = [];
    state.order.forEach(index => {
      if (cardsArr[index]?.id) {
        rankIdArr.push(cardsArr[index].id);
      }
    })
    TutorialDataService.updateOrder(currentTutorial.id, rankIdArr)
    .then(response => {
      setMessageObj({message:response.data.message, success:1, errorObj:{}});
    })
    .catch(e => {
      setMessageObj({message:"", errorObj:e, success:0});
    });
  };

  // Drag and drop start
  const items = range(MAX);
  const [state, setState] = useState({
    order: items,
    dragOrder: items, // items order while dragging
    draggedIndex: null
  });

  const handleDrag = useCallback(({translation, id}) => {
    const delta = Math.round(translation.y / HEIGHT);
    const index = state.order.indexOf(id);
    const dragOrder = state.order.filter(index => index !== id);

    if (!inRange(index + delta, 0, items.length)) {
      return;
    }

    dragOrder.splice(index + delta, 0, id);

    setState(state => ({
      ...state,
      draggedIndex: id,
      dragOrder
    }));
  }, [state.order, items.length]);

  const handleDragEnd = useCallback(() => {
    setState(state => ({
      ...state,
      order: state.dragOrder,
      draggedIndex: null
    }));
  }, []);
  // Drag and drop end

  if (!isTutorialLoaded || !areCardsLoaded) {
    return null;
  } else {

    return (

      <div style={orderContainerStyle} className="orderContainer">

        <div>
          <div>
            <span className="titleEditLabel"> {currentTutorial.title}</span> &nbsp;
            <Link
              to={"/tutorials/" + currentTutorial.id}
              className="btn btn-secondary backToEditBtn"
            >
              Back to Edit
            </Link>
          </div>
          <div style={{clear:"both"}} />
          <br />

          <Message messageObj={messageObj} />

        </div>

        {currentTutorial.published === true
          ? ("")
          : (

            <>
              <div>
                <span className="editLabel">Order Flashcards</span>
                &nbsp;
                <span>Drag and drop to set the desired order in which the flashcards will appear. When done, hit Save Order.</span>
                {cardsArr.length ? (
                <div className='saveOrderBtnCont'>

                  <button
                    type='button'
                    className='btn btn-success'
                    onClick={saveOrder}
                  >Save Order</button>
                </div>
                ) : (
                  " (You don't have any flashcards to order. Click 'Back to Edit' and add some!)"
                )}
                {cardsArr.map((cardObj, index) => {

                  const isDragging = state.draggedIndex === index;
                  const top = state.dragOrder.indexOf(index) * (HEIGHT + 10);
                  const draggedTop = state.order.indexOf(index) * (HEIGHT + 10);
                  return (
                    <Draggable
                      key={index}
                      id={index}
                      onDrag={handleDrag}
                      onDragEnd={handleDragEnd}
                    >
                      <Rect
                        isDragging={isDragging}
                        top={isDragging ? draggedTop : top}
                      >
                      Q:{cardObj.question}
                      <br />
                      A:{cardObj.answer}
                      </Rect>
                    </Draggable>
                  )

                })}

              </div>
            </>

          )}

      </div>

    );
  }
};

const Rect = styled.div.attrs(props => ({
  style: {
    transition: props.isDragging ? 'none' : 'all 500ms'
  }
}))`
  width: 1110px;
  user-select: none;
  height: ${HEIGHT}px;
  background: #fff;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: left;
  position: absolute;
  top: ${({top}) => 0 + top}px;
  left: 0px;
  padding:8px;
`;

export default Order;
