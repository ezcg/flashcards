import React, { useState, useEffect } from "react";

import UserService from "../services/user.service";
import Message
  from "./Message";

const BoardAdmin = () => {
  const [content, setContent] = useState("");
  const [messageObj, setMessageObj] = useState({message:"", success:0, errorObj:{}});

  useEffect(() => {
    UserService.getAdminBoard().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        setMessageObj({message:"", success:0, errorObj: error});

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

export default BoardAdmin;
