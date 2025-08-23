import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import connectDB from "./utils/db.js"
import userRoute from "./routers/user.route.js"
import postRoute from "./routers/post.route.js"
import messageRoute from "./routers/message.route.js"
import { app, server } from "./socket/socket.js"
import path from "path"

dotenv.config({})
const __dirname = path.resolve()


const PORT = process.env.PORT || 3000
// middleware
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))
const corsOptions = {
    origin: "https://fliksta-production.up.railway.app",
    credentials: true
}
app.use(cors(corsOptions))

app.get("/", (req, res) => {
    res.redirect("https://fliksta-production.up.railway.app/login")
})

// api calls
app.use("/api/v1/user", userRoute)

app.use("/api/v1/post", postRoute)
app.use("/api/v1/message", messageRoute)

app.use(express.static(path.join(__dirname, "/frontend/dist")))
app.use((req , res) => {
    res.sendFile(path.resolve(__dirname, "frontend" , "dist" , "index.html"))
})


server.listen(PORT, () => {
    connectDB()
    console.log(`Server listen at PORT ${PORT}`);
})

