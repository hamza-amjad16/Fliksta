import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import MainLayout from "./components/MainLayout";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import Chatpage from "./components/Chatpage";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { useSelector } from "react-redux";

function App() {
  const {user} = useSelector(store => store.auth)
  useEffect(() => {
    if(user){
      const socketio = io("http://localhost:4000", {
        query: {
          userId: user?._id
        },
        transports: ["websocket"] // uneccessry api calls
      })
      
    }
  },[])
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="profile/:id" element={<Profile />} />
            <Route path="account/edit" element={<EditProfile />} />
            <Route path="chat" element={<Chatpage />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
