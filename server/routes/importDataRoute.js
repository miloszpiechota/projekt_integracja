// routes/importDataRoute.js

const express = require('express');
const router = express.Router();
const ForestArea = require('../models/forestAreaModel');
const IndustrialDevelopment = require('../models/industrialDevelopmentModel');

router.get('/', async (req, res) => {
  try {
    const forestData = await ForestArea.find({}).limit(100); // Pobierz 5 dokumentów z kolekcji forestAreas
    const industrialData = await IndustrialDevelopment.find({}).limit(100); // Pobierz 5 dokumentów z kolekcji industrialDevelopments
    res.status(200).json({ forestData, industrialData }); // Zwróć dane w formacie JSON
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
