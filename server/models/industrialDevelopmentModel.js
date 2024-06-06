// industrialDevelopmentModel.js
const mongoose = require("mongoose");

const industrialDevelopmentSchema = new mongoose.Schema({
  country: String,
  item: String,
  year: Number,
  value: { type: Number, default: null } // Dodaj obsługę wartości null
});

const IndustrialDevelopment = mongoose.model("IndustrialDevelopment", industrialDevelopmentSchema);

module.exports = IndustrialDevelopment;