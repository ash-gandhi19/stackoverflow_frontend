import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Questions from "./pages/Questions";
import ViewQuestion from "./pages/ViewQuestion";
import TagResults from "./pages/TagResults";
import Header from "./components/Header";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import CommonContext from "./context/CommonContext";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import SearchResults from "./pages/SearchResults";
import Tags from "./pages/Tags";
//import PrivateRoute from "./components/PrivateRoute";
import CreateQuestion from "./pages/CreateQuestion";
import UpdateQuestion from "./pages/UpdateQuestion";
import UpdateProfile from "./pages/UpdateProfile";
import ResetPassword from "./pages/ResetPassword";

function App() {
  axios.defaults.baseURL = "http://localhost:5000";

  const [isLoggedIn, SetIsLoggedIn] = useState(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="App">
      <ToastContainer position="top-right" />

      <CommonContext.Provider
        value={{ isLoggedIn, SetIsLoggedIn, isLoading, setIsLoading }}
      >
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/home" exact element={<Home />} />

            <Route path="/questions" exact element={<Questions />} />
            <Route
              path="/questions/ask"
              exact
              element={isLoggedIn ? <CreateQuestion /> : <Login />}
            />
            <Route
              path="/questions/update/:id"
              exact
              element={isLoggedIn ? <UpdateQuestion /> : <Login />}
            />
            <Route
              path="/questions/:id"
              exact
              element={
                isLoggedIn ? <ViewQuestion value={isLoggedIn} /> : <Login />
              }
            />

            <Route
              path="/profile"
              exact
              element={isLoggedIn ? <Profile /> : <Login />}
            />
            <Route
              path="/profile/edit"
              exact
              element={isLoggedIn ? <UpdateProfile /> : <Login />}
            />

            <Route path="/tags" exact element={<Tags />} />

            <Route path="/tags/:tag" exact element={<TagResults />} />
            <Route path="/search/:keyword" exact element={<SearchResults />} />

            <Route path="/login" exact element={<Login />} />
            <Route path="/signup" exact element={<Signup />} />
            <Route path="/forgotpassword" exact element={<ForgotPassword />} />
            <Route
              path="/resetpassword/:jwt"
              exact
              element={<ResetPassword />}
            />
            <Route path="/" exact element={<Home />} />
          </Routes>
        </BrowserRouter>
      </CommonContext.Provider>
    </div>
  );
}

export default App;
