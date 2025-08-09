import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";

export const addnewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) {
      return res.status(401).json({
        message: "Image required",
        success: false,
      });
    }

    // image upload   using sharp
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    // convert in dataUri
    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });

    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: "author", select: "-password" });

    await res.status(201).json({
      message: "New Post added",
      post,
      success: true,
    });
  } catch (error) {
    console.log("Add new Post error", error);
  }
};

// is ma sab Post hai jo First page per hota hai
export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });
    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log("Get All post error", error);
  }
};

// is ma jo Author hai jis account ka us ke post
export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "username profilePicture",
      })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });
    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log("get user post", error);
  }
};

export const LikePost = async (req, res) => {
  try {
    const LikekrnawalaUserkiId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    // like logic
    await post.updateOne({ $addToSet: { likes: LikekrnawalaUserkiId } });
    // add to set sirf unique matlab bar bar like nhi kr sakta
    await post.save();

    // implement socket.io for real time notification

    return res
      .status(200)
      .json({ message: "Post liked Successfully", success: true });
  } catch (error) {
    console.log("LikePost error", error);
  }
};

export const DisLikePost = async (req, res) => {
  try {
    const LikekrnawalaUserkiId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    // Dislike logic
    await post.updateOne({ $pull: { likes: LikekrnawalaUserkiId } });
    await post.save();

    // implement socket.io for real time notification

    return res
      .status(200)
      .json({ message: "Post Disliked Successfully", success: true });
  } catch (error) {
    console.log("LikePost error", error);
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const CommentUser = req.id;

    const { text } = req.body;
    const post = await Post.findById(postId);
    if (!text)
      return res
        .status(400)
        .json({ message: "text is required", success: false });

    const comment = await Comment.create({
      text,
      author: CommentUser,
      post: postId,
    }).populate({
      path: "author",
      select: "username profilePicture",
    });

    post.comments.push(comment._id);
    await post.save();

    return res.status(201).json({
      message: "Comment Added",
      comment,
      success: true,
    });
  } catch (error) {
    console.log("Add comment error", addComment);
  }
};

export const getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ post: postId }).populate(
      "author",
      "username profilePicture"
    );
    if (!comments)
      return res
        .status(404)
        .json({ message: "No comments found for this state", success: false });
    return res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    console.log("Get Comment of Post error", error);
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not Found", success: false });

    // check the loggedIn user is the owner of post
    if (post.author.toString() !== authorId)
      return res
        .status(403)
        .json({ message: "Unauthorized User", success: false });

      // delete Post
      await Post.findByIdAndDelete(postId)

      // remove the postId from user
      let user = await User.findById(authorId)
      user.posts = user.posts.filter(id => id.toString() !== postId) // sari post da do bus delete ka aliwa
      await user.save()

      // delete wo comments jo delete post per huay whay hai
      await Comment.deleteMany({post: postId});

      return res.status(200).json({
        success: true,
        message: "Post deleted"
      })
  } catch (error) {
    console.log("Delete Post error", error);
  }
};

export const BookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id
    const authorId = req.id
    const post = await Post.findById(postId)
    if(!post)  return res.status(404).json({
        success: false,
        message: "Post not found"
      })

      const user = await User.findById(authorId)
      if(user.bookmarks.includes(post._id)){
        // Already bookmarked / remove from bookmarked
        await user.updateOne({$pull : {bookmarks: post._id}})
        await user.save()
        return res.status(200).json({
          type:"unsaved",
          message: "Post removed from bookmarked",
          success: true
        })
      } else {
        // Not bookmarked / Add to bookmarked
        await user.updateOne({$addToSet : {bookmarks: post._id}})
         await user.save()
        return res.status(200).json({
          type:"saved",
          message: "Post bookmarked",
          success: true
        })
      }
  } catch (error) {
    console.log("BookmarkPost error",error);
    
  }
}