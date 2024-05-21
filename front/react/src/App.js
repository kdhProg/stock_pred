import Header from "./layout/Header";
import Footer from "./layout/Footer";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import React from "react";
import Home from "./pages/Home";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Join from "./components/Join";
import Nav from "./components/Nav"
import StockSearchPage from "./pages/StockSearchPage";


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
          <Route path="/schStock" element={<StockSearchPage/>}/>
        </Routes>
        <Footer/>
      </BrowserRouter>
  );
}

export default App;
