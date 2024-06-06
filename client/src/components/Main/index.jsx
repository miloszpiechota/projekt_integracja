import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import Users from './Users';

const yaml = require('js-yaml'); 
const Main = () => {
  const [dane, ustawDane] = useState([]);

  const [conversionMessage, setConversionMessage] = useState(''); // Dodana linia
  
  const [showExploreForm, setShowExploreForm] = useState(false); // Dodane dla kontrolowania widoczności formularza
  const [searchResults, setSearchResults] = useState([]); // New state for search results
  const [searchQuery, setSearchQuery] = useState(''); // New state for search query
  const [searchType, setSearchType] = useState('entity'); // New state for search type

  const [chartImage, setChartImage] = useState(null);
  const [forestData, setForestData] = useState([]);
  const [industrialData, setIndustrialData] = useState([]);

  const [galleryImages, setGalleryImages] = useState([
    '/Forest_area_selected_countries.png',
    '/Industry_value_added_selected_countries.png',
    '/Industry_vs_Forest_Poland.png'
]);


  // Definiujemy zmienną forestAreaImage przed jej użyciem
  //const forestAreaImage = 'C:\\Users\\Milosz\\Desktop\\Semestr 6\\Szkielety programistyczne\\Lab7_MERNn\\server\\charts_images\\Forest_area_selected_countries.png';

  const navigate = useNavigate();



  
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  const handleGetUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const config = {
          method: 'get',
          url: 'http://localhost:8080/api/users',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
          },
        };
        const response = await axios(config);
        ustawDane(response.data.data);
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  

  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm("Czy na pewno chcesz usunąć swoje konto?");
    if (confirmDelete) {
      deleteUser();
    }
  };

  const handleConvertXmlToJson = async () => { // Nowa funkcja
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const config = {
          method: 'get',
          url: 'http://localhost:8080/api/users/convert-xml-to-json',
          headers: { 'Content-Type': 'application/json', 'x-access-token': token },
        };
        const { data: res } = await axios(config);
        setConversionMessage(res.message); // Ustawienie wiadomości o sukcesie
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };
  
  const deleteUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token is missing');
        return;
      }
      const config = {
        method: 'delete',
        url: 'http://localhost:8080/api/users',
        headers: { 'Content-Type': 'application/json', 'x-access-token': token },
      };
      const { data: res } = await axios(config);
      alert(res.message);
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };



  const handleConvertCsvToJson = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/users/convert-csv-to-json');
      setConversionMessage(response.data.message); // Ustawienie wiadomości o sukcesie
    } catch (error) {
      console.error(error);
      setConversionMessage('Błąd podczas konwersji pliku'); // Ustawienie wiadomości o błędzie
    }
  };

  const handleConvertXmlToYaml = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const config = {
          method: 'get',
          url: 'http://localhost:8080/api/users/convert-xml-to-yaml',
          headers: { 'Content-Type': 'application/json', 'x-access-token': token },
        };
        const { data: res } = await axios(config);
        const yamlData = yaml.dump(res.data); // Use yaml.dump instead of yaml.safeDump
        setConversionMessage(res.message);
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  const handleConvertXmlToCsv = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const config = {
          method: 'get',
          url: 'http://localhost:8080/api/users/convert-xml-to-csv',
          headers: { 'Content-Type': 'application/json', 'x-access-token': token },
        };
        const { data: res } = await axios(config);
        setConversionMessage(res.message);
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const config = {
          method: 'get',
          url: 'http://localhost:8080/api/users/search-co2-emissions',
          headers: { 'Content-Type': 'application/json', 'x-access-token': token },
          params: { [searchType]: searchQuery }
        };
        const { data: res } = await axios(config);
        setSearchResults(res.data); // Set search results in state
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  
  const handleGenerateCharts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const config = {
          method: 'get',
          url: 'http://localhost:8080/api/users/generate-charts',
          headers: { 'Content-Type': 'application/json', 'x-access-token': token },
          responseType: 'blob',
        };
        const response = await axios(config);
        const imageUrl = URL.createObjectURL(new Blob([response.data]));
        setChartImage(imageUrl);
        //fetchChartImages(); // Po wygenerowaniu nowego obrazu pobierz zaktualizowaną listę obrazów
      }
    } catch (error) {
      console.error(error);
    }
  };



  const handleExploreDataClick = () => {
    setShowExploreForm(!showExploreForm);
  };


  const handleConversionSelect = async (event) => {
    const value = event.target.value;
    if (value === 'xml') {
      await handleConvertXmlToJson();
    } else if (value === 'csv') {
      await handleConvertCsvToJson();
    } else if (value === 'yaml') {
      await handleConvertXmlToYaml();
    } else if (value === 'xml-to-csv') {
      await handleConvertXmlToCsv();
    }
  };

  const handleImportData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const config = {
          method: 'get',
          url: 'http://localhost:8080/api/import', // Zmiana endpointu na '/api/import'
          headers: { 'Content-Type': 'application/json', 'x-access-token': token },
        };
        const response = await axios(config);
        const { forestData, industrialData } = response.data;
        setForestData(forestData);
        setIndustrialData(industrialData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  



  return (
    <div className={styles.main_container}>
      <nav className={styles.navbar}>
        <h1>MySite</h1>
        <button className={styles.white_btn} onClick={handleLogout}>Logout</button>
        <button className={styles.white_btn} onClick={handleGetUsers}>Użytkownicy</button>
        <button className={styles.white_btn} onClick={handleImportData}>Pobierz dane</button>
        <button className={styles.white_btn} onClick={handleDeleteAccount}>Usuń Konto</button>
        <button className={styles.white_btn} onClick={handleGenerateCharts}>Generuj wykresy</button>
        <select className={styles.white_btn} onChange={handleConversionSelect}>
          <option value="">Konwersja</option>
          <option value="xml">Konwertuj XML do JSON</option>
          <option value="csv">Konwertuj CSV na JSON</option>
          <option value="yaml">Konwertuj XML do YAML</option>
          <option value="xml-to-csv">Konwertuj XML do CSV</option>
        </select>
        <button className={styles.white_btn} onClick={handleExploreDataClick}>Explore Data</button>
      </nav>
      {showExploreForm && (
       <div className={styles.centered}>
       <div>
         <select className={styles.white_btn} onChange={e => setSearchType(e.target.value)}>
           <option value="entity">Entity</option>
           <option value="code">Code</option>
         </select>
         <input
           type="text"
           className={styles.input}
           placeholder="Wpisz kraj lub kod"
           value={searchQuery}
           onChange={e => setSearchQuery(e.target.value)}
         />
         <button className={styles.white_btn} onClick={handleSearch}>Szukaj</button>
       </div>
     </div>
     
      )}
      
      {dane.length > 0 && (
        <div className={styles.users_container}>
          <h2>Lista użytkowników:</h2>
          <Users users={dane} />
        </div>
      )}
      
      {conversionMessage && (
        <div className={styles.conversion_message}>
          <p>{conversionMessage}</p>
        </div>
      )}
      {searchResults.length > 0 && (
        <div className={styles.search_results}>
          <h2>Wyniki wyszukiwania:</h2>
          <ul>
            {searchResults.map((result, index) => (
              <li key={index}>
                {result.Entity}, {result.Code}, {result.Year}, {result['Annual CO₂ emissions']}
              </li>
            ))}
          </ul>
        </div>
      )}{galleryImages.map((image, index) => (
        <img key={index} src={image} alt={`Chart ${index}`} className={styles.gallery_image} />
      ))}
     {forestData.length > 0 && (
        <div className={styles.data_container}>
          <h2>Forest Areas Data:</h2>
          <ul>
            {forestData.map((item, index) => (
              <li key={index}>
                Country: {item.country}, Item: {item.item}, Year: {item.year}, Value: {item.value}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Wyświetlanie danych dotyczących rozwoju przemysłowego */}
      {industrialData.length > 0 && (
        <div className={styles.data_container}>
          <h2>Industrial Development Data:</h2>
          <ul>
            {industrialData.map((item, index) => (
              <li key={index}>
                Country: {item.country}, Item: {item.item}, Year: {item.year}, Value: {item.value}
              </li>
            ))}
          </ul>
        </div>
      )}
    
      

      
    </div>
  );
};

export default Main;
