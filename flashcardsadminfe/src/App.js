import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Protected from "./components/Protected";
// import BoardUser from "./components/BoardUser";
// import BoardModerator from "./components/BoardModerator";
// import BoardAdmin from "./components/BoardAdmin";
import AddTutorial from "./components/AddTutorial";
import Tutorial from "./components/Tutorial";
import TutorialList from "./components/TutorialList";
import Order from "./components/Order";
import LoginHooks from './components/LoginHooks';
import LogoutHooks from './components/LogoutHooks';
import configs from './configs';

const App = () => {
  console.log("React.version:",React.version)
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
          <Link to="/" className="navbar-brand">
            FlashCards
          </Link>
          <div className="navbar-nav mr-auto">

            <li className="nav-item">
              <a href={configs.flashcardsappurl} className="nav-link" style={{color:"#ffffff"}}>
                App
              </a>
            </li>

            <li className="nav-item">
              <Link to="/add" className="nav-link" style={{color:"#ffffff"}}>
                Create
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/tutorials/my" className="nav-link" style={{color:"#ffffff"}}>
                My
              </Link>
            </li>

            {(showModeratorBoard || showAdminBoard) && (<li className="nav-item">
              <Link to="/tutorials" className="nav-link" style={{color:"#ffffff"}}>
                Moderate All
              </Link>
            </li>)}

            {(showModeratorBoard || showAdminBoard) && (<li className="nav-item">
              <Link to="/tutorials/unpublished" className="nav-link" style={{color:"#ffffff"}}>
                Moderate Unpublished
              </Link>
            </li>)}

            {(showModeratorBoard || showAdminBoard) && (<li className="nav-item">
              <Link to="/tutorials/undistributed" className="nav-link" style={{color:"#ffffff"}}>
                Moderate Undistributed
              </Link>
            </li>)}

            {/*{showAdminBoard && (*/}
            {/*  <li className="nav-item">*/}
            {/*    <Link to="/admin" className="nav-link" style={{color:"#ffffff"}}>*/}
            {/*      Admin Board*/}
            {/*    </Link>*/}
            {/*  </li>*/}
            {/*)}*/}

      </div>

      {currentUser ? (
        <div className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link to="/profile" className="nav-link">
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
          <Routes>
            {/*Public routes*/}
            <Route path="/" element={<Home />} />
            {/*Role related routes*/}
            {/*<Route path="/user" element={BoardUser} />*/}
            {/*<Route path="/mod" element={BoardModerator} />*/}
            {/*<Route path="/admin" element={BoardAdmin} />*/}

            {/*Protected - Registration required routes*/}
            <Route
              path="/tutorials"
              element={
                <Protected currentUser={currentUser}>
                  <TutorialList  props={{my:0,unpublishedOnly:0,all:1,undistributedOnly:0}} />
                </Protected>
              }
            />
            {/*<ProtectedRoute*/}
            {/*  exact path={["/", "/tutorials"]}*/}
            {/*  element={< TutorialList }*/}
            {/*  my={0}*/}
            {/*  unpublishedOnly={0}*/}
            {/*  all={1}*/}
            {/*  undistributedOnly={0}*/}
            {/*/>*/}

            <Route
              path="/tutorials/my"
              element={
                <Protected currentUser={currentUser}>
                  <TutorialList  props={{my:1,unpublishedOnly:0,all:0,undistributedOnly:0}} />
                </Protected>
              }
            />
            {/*<ProtectedRoute*/}
            {/*  exact path={["/tutorials/my"]}*/}
            {/*  component={TutorialList}*/}
            {/*  my={1}*/}
            {/*  unpublishedOnly={0}*/}
            {/*  all={0}*/}
            {/*  undistributedOnly={0}*/}
            {/*/>*/}
            <Route
              path="/tutorials/unpublished"
              element={
                <Protected currentUser={currentUser}>
                  <TutorialList  props={{my:0,unpublishedOnly:1,all:0,undistributedOnly:0}} />
                </Protected>
              }
            />
            {/*<ProtectedRoute*/}
            {/*  exact path={["/tutorials/unpublished"]}*/}
            {/*  component={TutorialList}*/}
            {/*  my={0}*/}
            {/*  unpublishedOnly={1}*/}
            {/*  all={0}*/}
            {/*  undistributedOnly={0}*/}
            {/*/>*/}
            <Route
              path="/tutorials/undistributed"
              element={
                <Protected currentUser={currentUser}>
                  <TutorialList  props={{my:0,unpublishedOnly:0,all:0,undistributedOnly:1}} />
                </Protected>
              }
            />
            {/*<ProtectedRoute*/}
            {/*  exact path={["/tutorials/undistributed"]}*/}
            {/*  component={TutorialList}*/}
            {/*  my={0}*/}
            {/*  unpublishedOnly={0}*/}
            {/*  all={0}*/}
            {/*  undistributedOnly={1}*/}
            {/*/>*/}

            <Route
              path="/add"
              element={
                <Protected currentUser={currentUser}>
                  <AddTutorial />
                </Protected>
              }
            />
            {/*<ProtectedRoute exact path="/add" component={AddTutorial} />*/}
            <Route
              path="/tutorials/:id"
              element={
                <Protected currentUser={currentUser}>
                  <Tutorial />
                </Protected>
              }
            />
            {/*<ProtectedRoute path="/tutorials/:id" component={Tutorial} />*/}
            <Route
              path="/order/:id"
              element={
                <Protected currentUser={currentUser}>
                  <Order />
                </Protected>
              }
            />
            {/*<ProtectedRoute path="/order/:id" component={Order} />*/}
            <Route
              path="/tutorials/:id"
              element={
                <Protected currentUser={currentUser}>
                  <Tutorial />
                </Protected>
              }
            />
            {/*<ProtectedRoute path="/profile" component={Profile} />*/}
            <Route
              path="/profile"
              element={
                <Protected currentUser={currentUser}>
                  <Profile />
                </Protected>
              }
            />

          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
