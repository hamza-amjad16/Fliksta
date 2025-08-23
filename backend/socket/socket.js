import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://fliksta-production.up.railway.app",
    methods: ["GET", "POST"],
  },
});

// -> jo user logged in hoga us ke socket id yaha per save kraye ga
//  -> matlab jitni socket id utna users online ya app sa connected hai
const userSocketMap = {};

export const getRecevierSocketId = (receiverId) => userSocketMap[receiverId]

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`User connected: UserID = ${userId}, socketId = ${socket.id}`);
  }
  // event
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export {app, server, io}