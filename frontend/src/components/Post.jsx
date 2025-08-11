import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
} from "lucide-react";
import { Button } from "./ui/button";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { POST_API } from "@/lib/const";
import { setPosts } from "@/redux/postSlice";

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLikes, setPostLikes] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments)
  const dispatch = useDispatch();
  const changeHandler = (e) => {
    const inputText = e.target.value;
    // condition check ka white space na ho
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };
  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(`${POST_API}/${post._id}/${action}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        const updatedLikes = liked ? postLikes - 1 : postLikes + 1;
        setPostLikes(updatedLikes);
        setLiked(!liked);

        //post ko update kro ga
        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("Like, Dislike error", error);
    }
  };
  const commentHandler = async () => {
    try {
      const res = await axios.post(`${POST_API}/${post._id}/comment` , {text} , {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      })
      if(res.data.success){
        toast.success(res.data.message)
        const updatedCommentData = [...comment, res.data.comment]
        setComment(updatedCommentData)

        const updatedPostData = posts.map(p => 
          p.id === post.id ? {...p , comment: updatedCommentData} : p
        )
        dispatch(setPosts(updatedPostData))
        setText("")
      }
    } catch (error) {
      console.log("Comment error", error);
      
    }
  }
  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(`${POST_API}/delete/${post?._id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        const updatedPosts = posts.filter(
          (postItem) => postItem._id !== post?._id
        );
        dispatch(setPosts(updatedPosts));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log("Delete Post handler", error);
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={post.author?.profilePicture} alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1>{post.author?.username}</h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            <Button
              variant={"ghost"}
              className="font-bold cursor-pointer w-fit text-[#ED4956]"
            >
              UnFollow
            </Button>
            <Button variant={"ghost"} className=" cursor-pointer w-fit">
              Add to Favourites
            </Button>
            {user &&
              user?._id === post?.author._id && ( // jo logged in user ho us ke post per delete aye sirf
                <Button
                  onClick={deletePostHandler}
                  variant={"ghost"}
                  className=" cursor-pointer w-fit "
                >
                  Delete
                </Button>
              )}
          </DialogContent>
        </Dialog>
      </div>
      <img
        src={post.image}
        alt="post_image"
        className="rounded-sm my-2 w-full aspect-square object-cover"
      />
      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-3">
          {liked ? (
            <Heart
              onClick={likeOrDislikeHandler}
              size={25}
              className="cursor-pointer text-red-500"
              fill="currentColor" // Red bhara hua
              stroke="none" // Outline remove
            />
          ) : (
            <Heart
              onClick={likeOrDislikeHandler}
              size={25}
              className="cursor-pointer hover:text-gray-600"
              fill="none" // Khali heart
              stroke="currentColor" // Outline
            />
          )}
          <MessageCircle
            onClick={() => setOpen(true)}
            className="cursor-pointer hover:text-gray-600"
          />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        <Bookmark className="cursor-pointer hover:text-gray-600" />
      </div>
      <span className="font-medium block mb-2 ">{postLikes} likes</span>
      <p>
        <span className="font-medium mr-2">{post.author?.username}</span>
        {post.caption}
      </p>
      <span
        onClick={() => setOpen(true)}
        className="cursor-pointer text-sm text-gray-400"
      >
        View all {comment.length} Comments
      </span>
      <CommentDialog open={open} setOpen={setOpen} />
      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={changeHandler}
          className="outline-none text-sm w-full"
        />
        {text && <span onClick={commentHandler} className="text-[#3BADF8]">Post</span>}
      </div>
    </div>
  );
};

export default Post;
