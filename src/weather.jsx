import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faSearch, faHeart, faHistory, faWind, 
    faDroplet, faTemperatureHigh, faCompass 
} from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

const WeatherApp = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentCity, setCurrentCity] = useState(null);
  const [favoriteCities, setFavoriteCities] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const getWeatherIcon = (weatherCode) => {
    const icons = {
        '01d': '☀️',
        '01n': '🌙',
        '02d': '⛅',
        '02n': '☁️',
        '03d': '☁️',
        '03n': '☁️',
        '04d': '☁️',
        '04n': '☁️',
        '09d': '🌧️',
        '09n': '🌧️',
        '10d': '🌦️',
        '10n': '🌧️',
        '11d': '⛈️',
        '11n': '⛈️',
        '13d': '❄️',
        '13n': '❄️',
        '50d': '🌫️',
        '50n': '🌫️'
    };
    return icons[weatherCode] || '🌡️';
  };

  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      setLoading(true);
      try {
        const [weatherResponse, forecastResponse] = await Promise.all([
            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&appid=${apiKey}&units=metric`),
            fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${searchTerm}&appid=${apiKey}&units=metric`)
        ]);

        if (!weatherResponse.ok || !forecastResponse.ok) {
            throw new Error('City not found');
        }

        const weatherData = await weatherResponse.json();
        const forecastData = await forecastResponse.json();
        
        const city = {
            name: searchTerm,
            weather: weatherData,
            forecast: forecastData.list.slice(0, 5)
        };
        
        setCurrentCity(city);
        setSearchHistory(prev => [city, ...prev.slice(0, 4)]);
        setSearchTerm('');
        setError(null);
      } catch (error) {
        setError('City not found. Please try again.');
      } finally {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900 p-4 pt-6 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-4 items-center mb-6">
          <div className="relative flex-1">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearch}
              placeholder="Search any city..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 backdrop-blur-md text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
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

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-500/20 backdrop-blur-md text-white p-4 rounded-xl mb-6"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {currentCity && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{currentCity.name}</h2>
                    <p className="text-5xl font-bold mb-4">
                      {Math.round(currentCity.weather.main.temp)}°C
                    </p>
                    <p className="text-xl capitalize">
                      {currentCity.weather.weather[0].description}
                    </p>
                  </div>
                  <div className="text-6xl">
                    {getWeatherIcon(currentCity.weather.weather[0].icon)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faTemperatureHigh} />
                    <span>Feels like: {Math.round(currentCity.weather.main.feels_like)}°C</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faDroplet} />
                    <span>Humidity: {currentCity.weather.main.humidity}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faWind} />
                    <span>Wind: {currentCity.weather.wind.speed} m/s</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCompass} />
                    <span>Direction: {currentCity.weather.wind.deg}°</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-4">5-Day Forecast</h3>
                <div className="space-y-4">
                  {currentCity.forecast?.map((forecast, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span>{new Date(forecast.dt * 1000).toLocaleDateString()}</span>
                      <span className="text-2xl">
                        {getWeatherIcon(forecast.weather[0].icon)}
                      </span>
                      <span>{Math.round(forecast.main.temp)}°C</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
            >
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WeatherApp;