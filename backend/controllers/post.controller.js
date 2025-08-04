import sharp from "sharp"
import cloudinary from "../utils/cloudinary.js"
import { Post } from "../models/post.model.js"
import { User } from "../models/user.model.js"

export const addnewPost = async (req , res) => {
    try {
        const {caption} = req.body
        const image = req.file
        const authorId = req.id

        if(!image) {
            return res.status(401).json({
                message: "Image required",
                success: false
            })
        }

        // image upload   using sharp
        const optimizedImageBuffer = await sharp(image.buffer)
        .resize({width:800, height:800 , fit:"inside"})
        .toFormat('jpeg', {quality:80})
        .toBuffer()

        // convert in dataUri
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString("base64")}`
        const cloudResponse = await cloudinary.uploader.upload(fileUri)
        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author: authorId
        })

        const user = await User.findById(authorId)
        if(user){
            user.posts.push(post._id)
            await user.save()
        }

        await post.populate({path: "author" , select: "-password"})

        await res.status(201).json({
            message: "New Post added",
            post,
            success: true
        })
        
    } catch (error) {
        console.log("Add new Post error", error);
    }
}