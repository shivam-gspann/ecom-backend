import { User } from "../models/user.model.js";
import jwt from 'jsonwebtoken';

const generateToken = async (userId) => {
  try {
      const secretKey = process.env.TOKEN_SECRET;  
      const options = {
        expiresIn: '1h', 
      };
    
      const token = jwt.sign({ userId }, secretKey, options); 

      return token;
  } catch (error) {
    console.error(error.message || "Something went wrong while generating token");
    throw new Error(
      error?.message || "Something went wrong while generating token"
    );
  }
};

export const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if ([name, email, password].some(field => !field.trim())) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Checking if user already exists
    const existedUser = await User.findOne({ email });
    if (existedUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Creating a new user
    const user = await User.create({ name, email, password });

    // Generating token
    const token = await generateToken(user._id); 

    // Getting created user without password
    const createdUser = await User.findById(user._id).select("-password");
    if (!createdUser) {
      return res.status(500).json({ error: "User not registered" });
    }

    return res.status(201).json({
      status: 201,
      token,
      data: createdUser,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error.message || "Something went wrong while registering user");
    return res.status(500).json({
      error: error.message || "Something went wrong while registering user",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password || !email.trim() || !password.trim()) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Fetching user from the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verifying password
    const isPasswordValid = await user.isPasswordCorrect(password); 
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" }); // Changed to 401
    }

    // Generating token
    const token = await generateToken(user._id); 

    // Getting user data (excluding password)
    const loggedInUser = await User.findById(user._id).select("-password");

    return res.status(200).json({
      status: 200,
      token,
      data: loggedInUser,
      message: "User logged in successfully",
    });
  } catch (error) {
    console.error(error.message || "Something went wrong while logging in user");
    return res.status(500).json({
      error: error.message || "Something went wrong while logging in user",
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    return res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error(error.message || "Something went wrong while logging out user");
    return res.status(500).json({
      error: error.message || "Something went wrong while logging out user",
    });
  }
};
