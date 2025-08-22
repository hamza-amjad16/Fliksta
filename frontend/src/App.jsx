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
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUsers } from "./redux/chatSlice";
import { setlikeNotification } from "./redux/rtnSlice";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { user } = useSelector((store) => store.auth);
  const { socket } = useSelector((store) => store.socketio);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user) {
      const socketio = io("http://localhost:4000", {
        query: {
          userId: user?._id,
        },
        transports: ["websocket"], // uneccessry api calls
      });
      dispatch(setSocket(socketio));
      // listen all the events
      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on("notification", (notification) => {
        dispatch(setlikeNotification(notification));
      });

      // cleanup
      return () => {
        socketio.close();
        dispatch(setSocket(null));
      };
    } else if (socket) {
      socket?.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
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
