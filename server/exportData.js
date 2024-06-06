const fs = require('fs');
const { promisify } = require('util');
const parseString = require('xml2js').parseString;
const ForestArea = require('./models/forestAreaModel');
const IndustrialDevelopment = require('./models/industrialDevelopmentModel');

// Promisify fs.readFile
const readFileAsync = promisify(fs.readFile);

async function exportData() {
  try {
    // Import danych z pliku forest_area.xml
    const forestData = await readFileAsync('C:/Users/Milosz/Desktop/Semestr 6/Szkielety programistyczne/Lab7_MERNn/server/datasets/forest_area.xml', 'utf-8');
    const forestResult = await parseXmlData(forestData, ForestArea);

    console.log('Imported forest area data:', forestResult);

    // Import danych z pliku industrial_development.xml
    const industrialData = await readFileAsync('C:/Users/Milosz/Desktop/Semestr 6/Szkielety programistyczne/Lab7_MERNn/server/datasets/industrial_development.xml', 'utf-8');
    const industrialResult = await parseXmlData(industrialData, IndustrialDevelopment);

    console.log('Imported industrial development data:', industrialResult);

    return { forestResult, industrialResult };
  } catch (error) {
    console.error('Error importing data:', error);
    throw error;
  }
}

async function parseXmlData(xmlData, Model) {
    return new Promise((resolve, reject) => {
      parseString(xmlData, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        // Przetwórz dane i zapisz do bazy danych
        const records = result.Root.data[0].record;
        const promises = records.map(record => {
          const value = parseFloat(record.field.find(field => field.$.name === 'Value')._);
          // Check if value is a valid number
          const newValue = isNaN(value) ? null : value;
          const newRecord = {
            country: record.field.find(field => field.$.name === 'Country or Area')._,
            item: record.field.find(field => field.$.name === 'Item')._,
            year: parseInt(record.field.find(field => field.$.name === 'Year')._),
            value: newValue
          };
  
          // Zapisz do odpowiedniej kolekcji
          return Model.create(newRecord);
        });
  
        Promise.all(promises)
          .then(data => resolve(data))
          .catch(error => reject(error));
      });
    });
  }

  module.exports = exportData;