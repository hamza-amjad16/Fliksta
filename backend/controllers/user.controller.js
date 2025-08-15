import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(401).json({
        message: "Something is missing",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({
        message: "Email already exsist",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Account created Successfully",
      success: true,
    });
  } catch (error) {
    console.log("Register error", error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        message: "Something is missing",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }
    // populate each post in the posts array
    const populatedPosts = await Promise.all(
      user.posts.map(async (postId) => {
        const post = await Post.findById(postId)
        if(post.author.equals(user._id)){
          return post
        }
        return null
      })
    )
    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: populatedPosts,
    };

    const token = await jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );
    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${user.username}`,
        success: true,
        user,
      });
  } catch (error) {
    console.log("Login error", error);
  }
};

export const logout = async (_, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "Logout successfully",
      success: true,
    });
  } catch (error) {
    console.log("Logout error", error);
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId).select("-password");
    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log("Get Profile error", error);
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;
    let cloudResponse;
    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(401).json({
        message: "User not Found",
        success: false,
      });
    }
    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

    await user.save();

    return res.status(200).json({
      message: "Profile Updated",
      success: true,
      user,
    });
  } catch (error) {
    console.log("Edit Profile error", error);
  }
};

export const getSuggestedUser = async (req, res) => {
  try {
    const suggestedUser = await User.find({ _id: { $ne: req.id } }).select(
      "-password"
    );
    if (!suggestedUser) {
      return res.status(400).json({
        message: "Currently do not any users",
        success: false,
      });
    }

    return res.status(200).json({
      success: false,
      users: suggestedUser,
    });
  } catch (error) {
    console.log("Get suggested User", error);
  }
};

export const followOrUnfollow = async (req, res) => {
  try {
    const followKrnayWala = req.id; //logged In user
    const jiskoFollowkroga = req.params.id; // jisko loggendIn follow kra ga
    if (followKrnayWala === jiskoFollowkroga) {
      return res.status(401).json({
        message: "You cannot follow/unfollow yourself",
        success: false,
      });
    }

    const user = await User.findById(followKrnayWala);
    const targetUser = await User.findById(jiskoFollowkroga);

    if (!user || !targetUser) {
      return res.status(401).json({
        message: "User not found",
        success: false,
      });
    }
    // Now check follow krna hai ya unfollow
    const isFollowing = user.following.includes(jiskoFollowkroga); // kya phela sa follow kra hua hai
    if (isFollowing) {
      //  unFollow logic
      await Promise.all([
        User.updateOne(
          { _id: followKrnayWala },
          { $pull: { following: jiskoFollowkroga } }
        ),
        User.updateOne(
          { _id: jiskoFollowkroga },
          { $pull: { followers: followKrnayWala } }
        ),
      ]);
      return res
        .status(200)
        .json({ message: "Unfollow successfully", success: true });
    } else {
      // follow logic
      // jab 1 sath 2 documents handle krta hai to promise.all()
      await Promise.all([
        User.updateOne(
          { _id: followKrnayWala },
          { $push: { following: jiskoFollowkroga } }
        ), // User ke following
        User.updateOne(
          { _id: jiskoFollowkroga },
          { $push: { followers: followKrnayWala } }
        ), // Jisko follow kiya us ka followers
      ]);
      return res
        .status(200)
        .json({ message: "follow successfully", success: true });
    }
  } catch (error) {
    console.log("FolloworUnfollow", error);
  }
};
