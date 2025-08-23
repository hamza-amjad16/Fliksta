import express from "express"
import { isAuthenticated } from "../middlewares/Authenticated.js"
import { getMessage, sendMessage } from "../controllers/message.controller.js"

const router = express.Router()
router.route("/send/:id").post(isAuthenticated, sendMessage)
router.route("/all/:id").get(isAuthenticated, getMessage)

console.log("✅ message routes loaded");

export default router