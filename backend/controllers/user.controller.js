import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

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

    let user = await User.find({ email });
    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if(!isPasswordMatch){
        return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }
    user = {
        _id: user._id,
        username: user.username,
        email: user.email,
         profilePitcure: user.profilePitcure,
         bio: user.bio,
         followers: user.followers,
         following: user.following,
         posts: user.posts,

    }

    const token = await jwt.sign({userId: user._id}, process.env.JWT_SECRET_KEY , {expiresIn: "1d"})
    return res.cookie("token", token , {httpOnly: true, sameSite: true, maxAge: 1*24*60*60*1000}).json({
        message: `Welcome back ${user.username}`,
        success: true,
        user
    })
  } catch (error) {
    console.log("Login error", error);
  }
};
