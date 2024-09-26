import { User } from "../models/user.model.js";

export const registerUser = async (req, res) => {
  try {
    // Fetching data from req.body
    const { username, fullName, email, password } = req.body;

    console.log(username)

    if ([username, fullName, email, password].some(field => !field || field.trim() === "")) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Checking user availability
    const existedUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existedUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Creating new user
    const user = await User.create({
      username: username.toLowerCase(),
      fullName,
      email,
      password,
    });

    // Getting created user without password
    const createdUser = await User.findById(user._id).select("-password");
    if (!createdUser) {
      return res.status(500).json({ error: "User not registered" });
    }

    // Sending response
    return res.status(201).json({
      status: 201,
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
    // Fetching data from req.body
    const { username, password } = req.body;
    if ([username, password].some(field => !field || field.trim() === "")) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Getting user data from the database
    const user = await User.findOne({username});
    if (!user) {
      return res.status(400).json({ error: "User doesn't exist" });
    }

    // Checking password
    if (user.password != password) {
      return res.status(409).json({ error: "Invalid user credentials" });
    }

    // Getting logged in user data from the database
    const loggedInUser = await User.findById(user._id).select("-password");

    // Sending response
    return res.status(200).json({
      status: 200,
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

