// Importing necessary modules
import userModel from "../../../../DB/model/User.model.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { sendEmail } from "../../../services/email.js";
import { nanoid } from "nanoid";

// Defining a controller function for user registration
export const signUp = async (req, res) => {
  try {
    // Extracting user data from the request body
    const { userName, email, password, cPassword, role } = req.body;

    if (password == cPassword) {
      // Checking if the user exists in the database
      const foundedUser = await userModel.findOne({ email });

      if (foundedUser) {
        res.json({ message: "You're already registered." });
      } else {
        // Hashing the password
        let hashed = bcrypt.hashSync(password, parseInt(process.env.saltRound));
        let user = new userModel({ userName, email, password: hashed, role });

        // Saving the user to the database
        let savedUser = await user.save();
        let token = jwt.sign({ id: savedUser._id }, process.env.jwtkey, { expiresIn: 60 });

        res.json({ message: "Added", savedUser, token });
      }
    } else {
      res.json({ message: "Password should match cPassword." });
    }
  } catch (error) {
    res.json({ message: 'Error', error });
  }
};

// Defining a controller function for user login
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Checking if the user exists in the database
    const foundedUser = await userModel.findOne({ email });

    if (foundedUser) {
      // Comparing the password with the hashed password in the database
      let matched = await bcrypt.compare(password, foundedUser.password);

      if (matched) {
        // Generating a token for authentication
        let token = jwt.sign({ isLogin: true, id: foundedUser._id }, process.env.jwtkey);
        res.status(202).json({ message: "Welcome", foundedUser, token });
      } else {
        res.status(401).json({ message: "Password incorrect" });
      }
    } else {
      res.status(404).json({ message: "Unregistered account!" });
    }
  } catch (error) {
    res.json({ message: 'Error', error });
  }
};

// Defining a controller function for email confirmation (commented out the verification logic)
export const confirmEmail = async (req, res) => {
  try {
    // Commented out the verification logic
    // ...
    // Commented out the verification logic
  } catch (error) {
    res.redirect("getawork.in");
  }
};

// Defining a controller function for refreshing the token (commented out the verification logic)
export const refreshToken = async (req, res) => {
  try {
    // Commented out the verification logic
    // ...
    // Commented out the verification logic
  } catch (error) {
    // If an error occurs, send an error message
    res.json({ message: 'Error', error });
  }
};