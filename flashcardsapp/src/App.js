import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Cards
  from "./Cards";
import Categories from "./Categories.js"
import List from "./List"

export default function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/">
            <Categories />
          </Route>
          <Route path="/list/:subcategory" component={List} />
          <Route path="/:tutorialId" component={Cards} />
        </Switch>
      </div>
    </Router>
  );
}

