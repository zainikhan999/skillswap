const mongoose = require("mongoose");

const SkillFormSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    default: "Pakistan",
    immutable: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    required: true,
  },
});

const SkillForm = mongoose.model("SkillForm", SkillFormSchema);

module.exports = SkillForm;