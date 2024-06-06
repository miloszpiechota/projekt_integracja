const router = require('express').Router();
const { User, validate } = require('../models/user');
const bcrypt = require('bcrypt');
const tokenVerification = require('../middleware/tokenVerification');
const csvtojson = require('csvtojson');

const path = require('path');
const xml2js = require('xml2js');
const yaml = require('js-yaml'); 
const { spawn } = require('child_process');

const fs = require('fs');

// Dodaj nowego użytkownika
router.post('/', async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (user) return res.status(409).send({ message: 'User with given email already exists!' });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    await new User({ ...req.body, password: hashPassword }).save();
    res.status(201).send({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Pobierz wszystkich użytkowników
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.send({ data: users });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

router.get('/details', tokenVerification, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).send({ message: 'User not found' });
    res.send({ data: user });
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
});


// Usuń konto użytkownika
router.delete('/', tokenVerification, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user._id);
    if (!deletedUser) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.status(200).send({ message: 'User account deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

router.get('/convert-xml-to-json', tokenVerification, async (req, res) => {
  const xmlFilePath = path.join(__dirname, '../datasets/forest_area.xml');
  const jsonFilePath = path.join(__dirname, '../converted/forest_area.json');

  fs.readFile(xmlFilePath, 'utf8', (err, xmlData) => {
    if (err) {
      console.error('Error reading XML file:', err);
      return res.status(500).send({ message: 'Error reading XML file' });
    }

    xml2js.parseString(xmlData, { explicitArray: false }, (err, jsonData) => {
      if (err) {
        console.error('Error converting XML to JSON:', err);
        return res.status(500).send({ message: 'Error converting XML to JSON' });
      }

      fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
          console.error('Error writing JSON file:', err);
          return res.status(500).send({ message: 'Error writing JSON file' });
        }

        res.send({ message: 'Conversion successful', jsonFilePath });
      });
    });
  });
});

// Nowy endpoint do konwersji CSV na JSON
router.get('/convert-csv-to-json', async (req, res) => {
  const csvFilePath = path.join(__dirname, '../datasets/co2-emissions.csv');
  const jsonFilePath = path.join(__dirname, '../converted/co2-emissions.json');

  try {
    const jsonArray = await csvtojson().fromFile(csvFilePath);
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonArray, null, 2), 'utf-8');
    res.status(200).send({ message: 'Konwersja z CSV do JSON zakończona pomyślnie' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Błąd podczas konwersji pliku' });
  }
});

router.get('/convert-xml-to-yaml', tokenVerification, async (req, res) => {
  const xmlFilePath = path.join(__dirname, '../datasets/forest_area.xml');
  const yamlFilePath = path.join(__dirname, '../converted/forest_area.yaml');

  fs.readFile(xmlFilePath, 'utf8', (err, xmlData) => {
    if (err) {
      console.error('Error reading XML file:', err);
      return res.status(500).send({ message: 'Error reading XML file' });
    }

    xml2js.parseString(xmlData, { explicitArray: false }, (err, jsonData) => {
      if (err) {
        console.error('Error converting XML to JSON:', err);
        return res.status(500).send({ message: 'Error converting XML to JSON' });
      }

      const yamlData = yaml.dump(jsonData); // Use yaml.dump instead of yaml.safeDump

      fs.writeFile(yamlFilePath, yamlData, (err) => {
        if (err) {
          console.error('Error writing YAML file:', err);
          return res.status(500).send({ message: 'Error writing YAML file' });
        }

        res.send({ message: 'Conversion successful', yamlFilePath });
      });
    });
  });

});

router.get('/convert-xml-to-csv', tokenVerification, async (req, res) => {
  const xmlFilePath = path.join(__dirname, '../datasets/industrial_development.xml');
  const csvFilePath = path.join(__dirname, '../converted/industrial_development.csv');

  fs.readFile(xmlFilePath, 'utf8', (err, xmlData) => {
    if (err) {
      console.error('Error reading XML file:', err);
      return res.status(500).send({ message: 'Error reading XML file' });
    }

    xml2js.parseString(xmlData, { explicitArray: false }, (err, jsonData) => {
      if (err) {
        console.error('Error converting XML to JSON:', err);
        return res.status(500).send({ message: 'Error converting XML to JSON' });
      }

      const records = jsonData.Root.data.record.map(record => {
        const row = {};
        record.field.forEach(field => {
          row[field.$.name] = field._ || '';
        });
        return row;
      });

      const csvHeaders = Object.keys(records[0]).join(',');
      const csvData = records.map(record => Object.values(record).join(',')).join('\n');
      const csvContent = `${csvHeaders}\n${csvData}`;

      fs.writeFile(csvFilePath, csvContent, 'utf8', (err) => {
        if (err) {
          console.error('Error writing CSV file:', err);
          return res.status(500).send({ message: 'Error writing CSV file' });
        }

        res.send({ message: 'Conversion successful', csvFilePath });
      });
    });
  });
});

// Endpoint to search CO2 emissions data
router.get('/search-co2-emissions', tokenVerification, async (req, res) => {
  const { entity, code } = req.query;
  const csvFilePath = path.join(__dirname, '../datasets/co2-emissions.csv');
  
  try {
      const jsonArray = await csvtojson().fromFile(csvFilePath);
      let filteredData = jsonArray.filter(row => 
          (entity && row.Entity.toLowerCase() === entity.toLowerCase()) || 
          (code && row.Code.toLowerCase() === code.toLowerCase())
      );
      
      filteredData = filteredData.filter(row => row['Annual CO₂ emissions'] && parseFloat(row['Annual CO₂ emissions']) > 0);
      
      res.status(200).send({ data: filteredData });
  } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error searching CO2 emissions data' });
  }
});

router.get('/generate-charts', tokenVerification, async (req, res) => {
  const pythonScriptPath = path.join(__dirname, '..', 'charts', 'generate_charts.py');
  const outputPath = path.join(__dirname, '..', 'output_charts', 'chart.png');

  const pythonProcess = spawn('python', [pythonScriptPath]);

  pythonProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    if (code === 0) {
      res.sendFile(outputPath);
    } else {
      res.status(500).send({ message: 'Error generating chart' });
    }
  });
});


module.exports = router;
