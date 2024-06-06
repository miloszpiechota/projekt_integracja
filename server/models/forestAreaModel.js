const mongoose = require('mongoose');

const forestAreaSchema = new mongoose.Schema({
    country: String,
    item: String,
    year: Number,
    value: { type: Number, default: null } // Dodaj obsługę wartości null lub inną wartość domyślną
  });
  

const ForestArea = mongoose.model('ForestArea', forestAreaSchema);

module.exports = ForestArea;
