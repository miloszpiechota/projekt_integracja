require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

// Middleware
app.use(express.json());
app.use(cors());

const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const exportDataRoutes = require('./routes/exportDataRoute'); // Dodana linia
const importDataRoutes = require('./routes/importDataRoute'); // Zaktualizowana ścieżka

// Użycie tras
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/export', exportDataRoutes); // Dodana linia
app.use('/api/import', importDataRoutes);

// Połączenie z bazą danych
mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to database successfully");
    startServer();
  })
  .catch(error => {
    console.error("Could not connect to the database:", error);
  });

function startServer() {
  const port = process.env.PORT || 8080;
  app.listen(port, () => console.log(`Nasłuchiwanie na porcie ${port}`));
}
