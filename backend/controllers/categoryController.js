import { GoogleGenAI } from "@google/genai";
import axios from "axios";
import Category from "../Model/Category.js"; // Import the Category model

// Set up Google Gemini API instance
const ai = new GoogleGenAI({
  apiKey: "AIzaSyAphzP-ZWnBV1Iq-oR5weu9FwwguIep4vo",
});

const HF_API_KEY = "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";

const fetchCategoriesFromDB = async () => {
  const categories = await Category.find({});
  return categories.map((cat) => cat.name);
};

// Function to check and store new category in MongoDB
const addNewCategoryToDatabase = async (category) => {
  try {
    // Check if the category already exists in the database
    const existingCategory = await Category.findOne({ name: category });

    // If the category does not exist, add it to the database
    if (!existingCategory) {
      const newCategory = new Category({ name: category });
      await newCategory.save();
      console.log(`Category "${category}" added to database.`);
    } else {
      console.log(`Category "${category}" already exists in the database.`);
    }
  } catch (error) {
    console.error("Database Error:", error.message);
  }
};

export const classifyText = async (req, res) => {
  const { text } = req.body;

  try {
    const CATEGORIES = await fetchCategoriesFromDB();

    if (!CATEGORIES.length) {
      return res
        .status(500)
        .json({ error: "No categories available for classification." });
    }
    let category = null;

    // Use Gemini to classify the text into a category
    const geminiResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `You are a classification expert who categorizes service descriptions into high-level, generic categories used in business directories or marketplaces.
Your job is to extract the **main theme** of a service and classify it under a **generic category** like "Fitness", "Education", "Health", "Marketing", etc.

❗ Important rules:
- Only output ONE WORD.
- Your response MUST be a broad category, NOT a specific activity or service.
- Do NOT return specific services that can't be used to categorize other services related to it
- Think of what section this service would fall under on a large platform like Fiverr, Upwork, or a local directory.

Examples:
- "I will be giving yoga classes" → Gym or Fitness
- "We offer WordPress and app development" → Web Development
- "Math tutoring for high school students" → Education
- "I will be your personal trainer" → Gym or Fitness
- "I will help you with cooking recipes" → Food

Now, analyze and classify the following service:
"${text}"
Return ONLY the category.`,
    });

    category =
      geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "Miscellaneous";

    // Add category to database if it's new
    await addNewCategoryToDatabase(category);

    console.log(`Assigned category: "${category}"`);

    res.json({
      category,
    });
  } catch (error) {
    console.error(
      "Gemini Classification Error:",
      error.response?.data || error.message
    );
    res.status(500).json({
      category: "Error",
      details: error.response?.data || error.message,
    });
  }
};
