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
import StockPredictPage from "./pages/StockPredictPage";
import SubscribePage from "./pages/SubscribePage";
import Mypage from "./pages/Mypage";
import UserFindIdForm from "./components/UserFindIdForm";
import NoticePage from "./pages/NoticePage";
import FreeBoardPage from "./pages/FreeBoardPage";
import PostDetail from "./pages/PostDetail";
import PostWrite from "./pages/PostWrite";


function App() {

  return (
      <BrowserRouter>
          <Header/>
          <Nav/>
          <Footer/>
          <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/login" element={<Login/>}/>
              <Route path="/logout" element={<Logout/>}/>
              <Route path="/Join" element={<Join/>}/>

              <Route path="/schStock" element={<StockSearchPage/>}/>
              <Route path="/predStock" element={<StockPredictPage/>}/>
              <Route path="/subscribePage" element={<SubscribePage/>}/>

              <Route path="/Mypage" element={<Mypage/>}/>
              <Route path="/UserFindIdForm" element={<UserFindIdForm/>}/>

              <Route path="/NoticePage" element={<NoticePage/>}/>
              <Route path="/FreeBoardPage" element={<FreeBoardPage/>}/>
              <Route path="/PostWrite" element={<PostWrite />} />
              <Route path="/post/:postId" element={<PostDetail/>}/>
          </Routes>
      </BrowserRouter>
  );
}

export default App;
