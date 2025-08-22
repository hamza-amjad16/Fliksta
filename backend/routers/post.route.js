import express from "express"
import { isAuthenticated } from "../middlewares/Authenticated.js"
import upload from "../middlewares/multer.js"
import { addComment, addnewPost, BookmarkPost, deletePost, DisLikePost, getAllPost, getCommentsOfPost, getUserPost, LikePost } from "../controllers/post.controller.js"

const router = express.Router()
router.route("/addpost").post(isAuthenticated, upload.single("image"), addnewPost)
router.route("/allpost").get(isAuthenticated, getAllPost)
router.route("/alluserpost").get(isAuthenticated, getUserPost)
router.route("/:id/like").get(isAuthenticated, LikePost)
router.route("/:id/dislike").get(isAuthenticated, DisLikePost)
router.route("/:id/comment").post(isAuthenticated, addComment)
router.route("/:id/comment/all").get(isAuthenticated, getCommentsOfPost)
router.route("/delete/:id").delete(isAuthenticated, deletePost)
router.route("/:id/bookmark").get(isAuthenticated, BookmarkPost)


export default router