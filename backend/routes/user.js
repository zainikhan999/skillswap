import express from "express";
import { signup } from "../controllers/authController.js";
import { signupValidator } from "../libs/authValidator.js";
import { validationHandler } from "../libs/authValidator.js";
import { loginValidator } from "../libs/authValidator.js";
import { login } from "../controllers/authController.js";
import { profile } from "../controllers/profile.js";
import { viewProfile } from "../controllers/profile.js";
import { uploadService } from "../controllers/uploadservice.js";
import { servicesValidator } from "../libs/servicesValidator.js";
import { getServices } from "../controllers/uploadservice.js";
import { myServices } from "../controllers/uploadservice.js";
import { deleteService } from "../controllers/deleteService.js"; // Import the deleteService controller
const app = express.Router();

app.post("/signup", signupValidator, validationHandler, signup);
app.post("/login", loginValidator, validationHandler, login);

// the below routes can also be accessed if the user is authorized
app.post("/submit-profile", profile);
app.get("/get-latest-profile", viewProfile);
app.post(
  "/upload-service",
  servicesValidator,
  validationHandler,
  uploadService
);
app.get("/get-all-gigs", getServices);
app.get("/get-my-gigs/:username", myServices); // Fetch gigs for a specific user
app.delete("/delete-gig/:gigId", deleteService); // Fetch gigs for a specific user

export default app;
