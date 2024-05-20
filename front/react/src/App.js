import Header from "./layout/Header";
import Footer from "./layout/Footer";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import React from "react";
import Home from "./components/Home";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Join from "./components/Join";
import Nav from "./components/Nav"


function App() {
  return (
      <BrowserRouter>
        <Header/>
        <Nav/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/logout" element={<Logout/>}/>
          <Route path="/Join" element={<Join/>}/>
        </Routes>
        <Footer/>
      </BrowserRouter>
  );
}

export default App;
