import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";
import Home from "./components/Home";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import BoardUser from "./components/BoardUser";
import BoardModerator from "./components/BoardModerator";
import BoardAdmin from "./components/BoardAdmin";
import AddTutorial from "./components/AddTutorial";
import Tutorial from "./components/Tutorial";
import TutorialList from "./components/TutorialList";
import Order from "./components/Order";
import LoginHooks from './components/LoginHooks';
import LogoutHooks from './components/LogoutHooks';
import configs from './configs';

const App = () => {

  const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }
  }, []);

  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark" style={{height:"70px"}}>
          <Link to={"/home"} className="navbar-brand">
            FlashCards
          </Link>
          <div className="navbar-nav mr-auto">

            <li className="nav-item">
              <a href={configs.flashcardsappurl} className="nav-link" style={{color:"#ffffff"}}>
                App
              </a>
            </li>

            <li className="nav-item">
              <Link to={"/add"} className="nav-link" style={{color:"#ffffff"}}>
                Create
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/tutorials/my"} className="nav-link" style={{color:"#ffffff"}}>
                My
              </Link>
            </li>

            {(showModeratorBoard || showAdminBoard) && (<li className="nav-item">
              <Link to={"/tutorials"} className="nav-link" style={{color:"#ffffff"}}>
                Moderate All
              </Link>
            </li>)}

            {(showModeratorBoard || showAdminBoard) && (<li className="nav-item">
              <Link to={"/tutorials/unpublished"} className="nav-link" style={{color:"#ffffff"}}>
                Moderate Unpublished
              </Link>
            </li>)}

            {(showModeratorBoard || showAdminBoard) && (<li className="nav-item">
              <Link to={"/tutorials/undistributed"} className="nav-link" style={{color:"#ffffff"}}>
                Moderate Undistributed
              </Link>
            </li>)}

            {showAdminBoard && (
              <li className="nav-item">
                <Link to={"/admin"} className="nav-link" style={{color:"#ffffff"}}>
                  Admin Board
                </Link>
              </li>
            )}

            {/*{currentUser && (*/}
            {/*  <li className="nav-item">*/}
            {/*    <Link to={"/user"} className="nav-link" style={{color:"#ffffff"}}>*/}
            {/*      User*/}
            {/*    </Link>*/}
            {/*  </li>*/}
            {/*)}*/}

      </div>

      {currentUser ? (
        <div className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link to={"/profile"} className="nav-link">
              {currentUser.name}
            </Link>
          </li>
          <li className="nav-item">
            <LogoutHooks />
          </li>
        </div>
      ) : (
        <div className="navbar-nav ml-auto">
          <LoginHooks />
        </div>
      )}
        </nav>

        <div className="container mt-3">
          <Switch>
            {/*Public routes*/}
            <Route exact path={["/", "/home"]} component={Home} />

            {/*Registration required routes*/}
            <ProtectedRoute
              exact path={["/", "/tutorials"]}
              component={TutorialList}
              my={0}
              unpublishedOnly={0}
              all={1}
              undistributedOnly={0}
            />
            <ProtectedRoute
              exact path={["/tutorials/my"]}
              component={TutorialList}
              my={1}
              unpublishedOnly={0}
              all={0}
              undistributedOnly={0}
            />
            <ProtectedRoute
              exact path={["/tutorials/unpublished"]}
              component={TutorialList}
              my={0}
              unpublishedOnly={1}
              all={0}
              undistributedOnly={0}
            />
            <ProtectedRoute
              exact path={["/tutorials/undistributed"]}
              component={TutorialList}
              my={0}
              unpublishedOnly={0}
              all={0}
              undistributedOnly={1}
            />

            <ProtectedRoute exact path="/add" component={AddTutorial} />
            <ProtectedRoute path="/tutorials/:id" component={Tutorial} />
            <ProtectedRoute path="/order/:id" component={Order} />
            <ProtectedRoute path="/profile" component={Profile} />

            {/*Role related routes*/}
            <Route path="/user" component={BoardUser} />
            <Route path="/mod" component={BoardModerator} />
            <Route path="/admin" component={BoardAdmin} />

          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
