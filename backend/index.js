require('dotenv').config();
const express = require('express');

const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');

const skillswapuser = require('./Model/User');  // Import User model
const SkillForm = require('./Model/SkillForm'); // Import SkillForm model

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Configuration
const MONGO_URI = process.env.MONGO_URI
// Connect to MongoDB using Mongoose
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB using Mongoose');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit the process if connection fails
    });

// Route to handle signup
app.post('/signup', async (req, res) => {
    let { userName, firstName, lastName, email, password } = req.body;

    if (!userName || !firstName || !lastName || !email || !password ) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const lowerCaseUserName = userName.toLowerCase();
    const lowerCaseEmail = email.toLowerCase();


    try {
        // Check if username or email already exists
        const existingUser = await skillswapuser.findOne({
            $or: [{ userName: lowerCaseUserName }, { email: lowerCaseEmail }],
        });

        if (existingUser) {
            const conflictField = existingUser.userName === lowerCaseUserName ? 'Username' : 'Email';
            return res.status(400).json({ message: `${conflictField} already exists` });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new skillswapuser({
            userName: lowerCaseUserName,
            firstName,
            lastName,
            email: lowerCaseEmail,
            password: hashedPassword,
         
        });

        const result = await newUser.save();
        res.status(201).json({ message: "User registered successfully", userId: result._id });
    } catch (error) {
        console.error('Error saving user data:', error);
        res.status(500).json({ message: "Internal server error" });
    }
});


app.post('/login', async (req, res) => {
    const { userName, password } = req.body;


    console.log(`Login attempt for username: ${userName}`);

    try {
      
        const user = await  skillswapuser.findOne({ userName: userName.toLowerCase() });

        if (user) {
            console.log('User found:', user);

            // Compare the entered password with the stored hashed password
            const passwordMatch = await bcrypt.compare(password, user.password);
            console.log('Password match:', passwordMatch);

            if (passwordMatch) {
                console.log('User login successful');
                return res.status(200).json({ message: 'User login successful', userType: 'user' });
            } else {
                console.log('Invalid password');
                return res.status(401).json({ message: 'Invalid username or password' });
            }
        }

        // If the user is not found
        console.log('User not found');
        return res.status(401).json({ message: 'Invalid username or password' });

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Route to handle skill form submission
app.post("/submit-profile", async (req, res) => {
    const { name, city, contactNumber, bio, skills } = req.body;
  
    if (!name || !city || !contactNumber || !bio || !skills || !Array.isArray(skills)) {
      return res.status(400).json({ message: "All fields are required and skills must be an array" });
    }
  
    try {
      const newProfile = new SkillForm({
        name,
        city,
        contactNumber,
        bio,
        skills,
      });
  
      await newProfile.save();
      res.status(201).json({ message: "Profile submitted successfully" });
    } catch (error) {
      console.error("Error submitting profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });


// the endpoint for the profile form
app.get("/get-latest-profile", async (req, res) => {
    try {
      const latestProfile = await SkillForm.findOne().sort({ _id: -1 }); // Fetch the latest profile
      if (!latestProfile) {
        return res.status(404).json({ message: "No profile found" });
      }
      res.json(latestProfile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
app.get("/", (req, res) => {
  res.send("Backend is working!");
});
// Start server
app.listen(5000, () => {
    console.log("Backend server running on port 5000S");
});

