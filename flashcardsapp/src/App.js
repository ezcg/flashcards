import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Cards from "./Cards";
import Categories from "./Categories.js"
import List from "./List"
import Drilltable from "./Drilltable"
import { GlobalProvider } from './context/GlobalState'

export default function App() {
  return (
    <GlobalProvider>
    <Router>
      <Routes>
        <Route exact path="/" element={<Categories/>} />
        <Route path="/list/:subcategory/:categoryId" element={<List/>} />
        <Route path="/:tutorialId" element={<Cards/>} />
        <Route path="/drilltable/:tutorialId" element={<Drilltable/>} />
      </Routes>
    </Router>
    </GlobalProvider>
  );
}

