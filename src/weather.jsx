import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faHeart, faHistory } from '@fortawesome/free-solid-svg-icons';

const WeatherApp = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentCity, setCurrentCity] = useState(null);
  const [favoriteCities, setFavoriteCities] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);

  const apiKey = 'f00c38e0279b7bc85480c3fe775d518c';

  useEffect(() => {
    const storedFavoriteCities = localStorage.getItem('favoriteCities');
    const storedSearchHistory = localStorage.getItem('searchHistory');
    if (storedFavoriteCities) {
      setFavoriteCities(JSON.parse(storedFavoriteCities));
    }
    if (storedSearchHistory) {
      setSearchHistory(JSON.parse(storedSearchHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favoriteCities', JSON.stringify(favoriteCities));
  }, [favoriteCities]);

  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();
        const city = { name: searchTerm, weather: data };
        setCurrentCity(city);
        setSearchHistory([city, ...searchHistory]);
        setSearchTerm('');
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
  };

  const handleAddToFavorites = (city) => {
    setFavoriteCities([city, ...favoriteCities]);
    alert('Added to favorites');
  };

  const handleRemoveFromFavorites = (name) => {
    setFavoriteCities(favoriteCities.filter((city) => city.name !== name));
  };

  const handleShowFavorites = () => {
    setShowFavorites(!showFavorites);
  };

  const handleShowHistory = () => {
    setShowHistory(!showHistory);
  };

  const handleSelectFromHistory = (city) => {
    setCurrentCity(city);
  };

  const handleDeleteFromHistory = (name) => {
    setSearchHistory(searchHistory.filter((city) => city.name !== name));
  };

  const getBackgroundColor = (weather) => {
    if (weather.main.temp >= 20) {
      return 'bg-gradient-to-r from-red-500 to-yellow-500';
    } else if (weather.main.temp < 10) {
      return 'bg-gradient-to-r from-blue-500 to-cyan-500';
    } else {
      return 'bg-gradient-to-r from-green-500 to-teal-500';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 pt-6 md:p-6 lg:p-12 xl:p-24">
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-full">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute top-1/2 transform -translate-y-1/2 left-4 text-gray-500"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleSearch}
            placeholder="Search city"
            className="w-full p-2 pl-10 text-sm text-gray-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative">
          <button
            onClick={handleShowFavorites}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md"
          >
            <FontAwesomeIcon icon={faHeart} />
          </button>
          {showFavorites && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg py-2 z-10">
              <h2 className="text-lg font-bold mb-2">Favorite Cities</h2>
              <ul>
                {favoriteCities.map((city) => (
                  <li
                    key={city.name}
                    className="py-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                    onClick={() => setCurrentCity(city)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">
                        {city.name} - {city.weather.main.temp}°C
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromFavorites(city.name);
                        }}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-lg"
                      >
                        <FontAwesomeIcon icon={faHeart} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="relative">
          <button
            onClick={handleShowHistory}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg shadow-md"
          >
            <FontAwesomeIcon icon={faHistory} />
          </button>
          {showHistory && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg py-2 z-10">
              <h2 className="text-lg font-bold mb-2">Search History</h2>
              <ul>
                {searchHistory.map((city) => (
                  <li
                    key={city.name}
                    className="py-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                    onClick={() => setCurrentCity(city)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">
                        {city.name} - {city.weather.main.temp}°C
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFromHistory(city.name);
                        }}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-lg"
                      >
                        <FontAwesomeIcon icon={faHeart} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {currentCity && (
        <div
          className={`mb-4 ${getBackgroundColor(currentCity.weather)}`}
          style={{
            opacity: currentCity ? 1 : 0,
            transform: currentCity ? 'scale(1)' : 'scale(0.95)',
            transition: 'opacity 0.3s, transform 0.3s',
          }}
        >
          <div className="p-4">
            <h2 className="text-2xl font-bold text-white">{currentCity.name}</h2>
            <p className="text-lg text-white">
              Temperature: {currentCity.weather.main.temp}°C
            </p>
            <p className="text-lg text-white">
              Humidity: {currentCity.weather.main.humidity}%
            </p>
            <p className="text-lg text-white">
              Wind: {currentCity.weather.wind.speed} m/s
            </p>
            <button
              onClick={() => handleAddToFavorites(currentCity)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mt-4 shadow-md"
            >
              <FontAwesomeIcon icon={faHeart} />
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;