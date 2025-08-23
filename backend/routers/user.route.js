import express from "express"
import { editProfile, followOrUnfollow, getProfile, getSuggestedUser, login, logout, register } from "../controllers/user.controller.js"
import { isAuthenticated } from "../middlewares/Authenticated.js"
import upload from "../middlewares/multer.js"

const router = express.Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").get(logout)
router.route("/:id/profile").get(isAuthenticated, getProfile)
router.route("/profile/edit").post(isAuthenticated,upload.single("profilePicture"),editProfile)
router.route("/suggessted").get(isAuthenticated , getSuggestedUser)
router.route("/followOrunfollow/:id").post(isAuthenticated, followOrUnfollow)

console.log("✅ user routes loaded");

export default router