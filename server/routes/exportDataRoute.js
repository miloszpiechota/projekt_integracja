const express = require('express');
const router = express.Router();
const importData = require('../exportData');

router.get('/export', async (req, res) => {
  try {
    await importData();
    res.status(200).json({ message: 'Data exported successfully' });
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;