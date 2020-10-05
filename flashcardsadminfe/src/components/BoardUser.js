import React, { useState, useEffect } from "react";

import UserService from "../services/user.service";
import Message
  from "./Message";

const BoardUser = () => {
  const [content, setContent] = useState("");
  const [messageObj, setMessageObj] = useState({message:"", success:0, errorObj:{}});

  useEffect(() => {
    UserService.getUserBoard().then(
      (response) => {
        setContent(response.data);
        console.log("A", response.data);
      },
      (error) => {
        setMessageObj({message:"", success:0, errorObj: error});
//         const _content =
//           (error.response &&
//             error.response.data &&
//             error.response.data.message) ||
//           error.message ||
//           error.toString();
// console.log("B", _content);
//         setContent(_content);
      }
    );
  }, []);

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>{content}</h3>
        <Message messageObj={messageObj} />

      </header>
    </div>
  );
};

export default BoardUser;
