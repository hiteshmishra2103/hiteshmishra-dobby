const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const cors = require("cors");

const JWT_SECRET = process.env.JWT_SECRET;

// Use cors middleware to allow requests from any origin
app.use(cors());



const { User, Images } = require('./db/db');
const { authenticateJwt } = require('./middleware/auth');

//for the dotenv file

//body parser middleware
app.use(express.json());

app.get("/me", authenticateJwt, async (req, res) => {
  // Get the user from the database

  const user = await User.findOne({ username: req.user.username });

  // If the user is not found
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  // Send the user in the response
  res.json({ user });
});

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }
  if (!password || password.length < 8) {
    console.log();
    return res
      .status(400)
      .json({ message: "Password is required and should be at least 8 characters long" });
  }

  const user = await User.findOne({ username });
  if (user) {
    return res.status(403).json({ message: "Username is already taken" });
  } else {

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ username, password: hashedPassword });

    // Save the user to the database
    await newUser.save();

    // Create a jwt token
    const token = jwt.sign({ username, password }, JWT_SECRET, {
      expiresIn: "72h",
    });

    // Send the token in the response
    res.json({ message: "User created successfullly!", token });

  }
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }
  if (!password) {
    return res
      .status(400)
      .json({ message: "Password is required" });
  }
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(403).json({ message: "Invalid username or password" });
  }

  // Check if the password is valid
  const isPasswordValid = bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(403).json({ message: "Invalid username or password" });
  }

  // Create a jwt token
  const token = jwt.sign({ username, password }, JWT_SECRET, {
    expiresIn: "72h",
  });
  // Send the token in the response
  res.json({ message: "Login successfullly!", token });
})

app.post('/upload', authenticateJwt, async (req, res) => {
  try {
    const { name, url } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (!url) {
      return res.status(400).json({ message: "Url is required" });
    }
    const user = await User.findOne({ username: req.user.username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newImage = new Images({ user: user._id, name, url });
    await newImage.save();
    res.json({ message: "Image uploaded successfully" });
  }
  catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }

})

app.get('/images', authenticateJwt, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
      
    }
    const images = await Images.find({ user: user._id });
    res.json({ images });
  }
  catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
  })

app.use((req, res, next) => {
  res.status(404).send("Not found");
});

if (mongoose.connection.readyState == 0) {
  // 0 = disconnected
  async function handlerfunction() {
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: "dobby",
    });
  }

  handlerfunction();

}


app.listen(3001, () => {
  console.log("listening on port 3001");
})