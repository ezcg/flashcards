import React from 'react';

function Message ({messageObj, cardId}) {

  if (!messageObj.message && !messageObj.errorObj) {
    return null;
  }
  // if it is a message for a card update, make sure it is the right card
  if (cardId && messageObj.cardId && cardId !== messageObj.cardId) {
    return null;
  }

  let msg = '';

  if (messageObj.message) {
    msg = messageObj.message;
  }
  if (messageObj.errorObj.response?.data?.message) {
    msg+= " " + messageObj.errorObj.response.data.message;
  }

  if (messageObj.errorObj.message) {
    msg+= " " + messageObj.errorObj.message;
  } else if (messageObj.errorObj.response?.status === 401) {
    msg+= "You do not have proper permissions to access this page. " + messageObj.errorObj.message + ". ";
  } else if (messageObj.errorObj.response?.status === 403) {
    msg+= "You must be logged in to do that. " + messageObj.errorObj.message + ". ";
  } else if (messageObj.errorObj.response?.status === 500) {
    msg+=" " + messageObj.errorObj.message + ". ";
  } else if (messageObj.errorObj.response?.status === 404) {
    msg+="Not finding that endpoint. " + messageObj.errorObj.message + ". ";
  }

  let msgStyle= {display:'none'};
  if (msg) {
    msgStyle = {display:'block'};
  }

  return <p style={msgStyle}>{messageObj.success === 0
    ? (<span className="errMsg">{msg}</span>)
    : (<span className="successMsg">{msg}</span>)
    }</p>

}

export default Message
