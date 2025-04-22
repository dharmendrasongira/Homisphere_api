import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if email already exists in database
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json({
      message: "Successfully created",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error creating user" });
  }
};
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username },
    });

    // If user doesn't exist, return error
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Create JWT token
    const age = 1000 * 60 * 60 * 24 * 7; // 1 week expiration

    const token = jwt.sign(
      { userId: user.id, isAdmin: true },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: age,
      }
    );
    // Set token in cookie and return response
    const { password: _, ...userInfo } = user;
    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: age,
      })
      .status(200)
      .json({ userInfo });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};

export const logout = (req, res) => {
  try {
    res
      .clearCookie("token") // Clear the token cookie
      .status(200) // Send OK status code
      .json({ message: "Logged out" }); // Response messag
    console.log("logout db operation");
  } catch (error) {
    // Log message for server
    console.error("Error logging out:", error);
  }
};

export const updateProfile = (req, res) => {
  console.log("update profile db operation");
};
