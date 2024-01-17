import { useState, useEffect } from 'react';
import axios from 'axios';


import { TiWeatherSunny } from "react-icons/ti";
import { TiWeatherDownpour } from "react-icons/ti";
import { FiSunset } from "react-icons/fi";
import { FiSunrise } from "react-icons/fi";

import { Text } from '@chakra-ui/react';




const WeatherComponent = ({ lat, lon, date }): any => {
  const [weatherData, setWeatherData] = useState(null);


  const getDaysFromNow = (dateString: any) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const providedDate = new Date(dateString);
    providedDate.setHours(0, 0, 0, 0);

    const diffDays = Math.round(Math.abs((providedDate - today) / oneDay));
    return diffDays;
  };

  const daysFromNow = getDaysFromNow(date);

  useEffect(() => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation_probability,rain&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,rain_sum,precipitation_hours,precipitation_probability_max&timezone=GMT`;

    const fetchWeather = async () => {
      try {
        const response = await axios.get(url)
        const dailyForecasts = response.data.daily;
        if (dailyForecasts) {
          setWeatherData(dailyForecasts);
        } else {
          console.log("Forecast for the specific day not found.");
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };
    fetchWeather();
  }, [lat, lon]);

  if (!weatherData) return <div>Loading...</div>;

  return (
    <div className='weather-container'>
      <div className='weather-icon-container'>
        {(weatherData?.precipitation_probability_max[daysFromNow] > 50) ?
          <TiWeatherDownpour size='4rem' />
          :
          <TiWeatherSunny size="4rem" />
        }
      </div>
      <p>Avg Temp: {((weatherData?.temperature_2m_max[daysFromNow] + weatherData?.temperature_2m_min[daysFromNow]) / 2).toFixed()}°C</p>
      <p>Chance of Rain: {weatherData?.precipitation_probability_max[daysFromNow]}% </p>
      <div className='sunrise-sunset-container'>
        <FiSunrise size="20px" />
        <Text>
          {weatherData?.sunrise[daysFromNow].slice(-5)}
        </Text>
        <FiSunset size="20px" />
        <Text>
          {weatherData?.sunset[daysFromNow].slice(-5)}
        </Text>
      </div>
    </div>
  );
};

export default WeatherComponent;


// useEffect(() => {
//   const apiKey = weatherApiKey; // Your OpenWeather API key stored in .env

//   const url = `api.openweathermap.org/data/2.5/forecast/daily?lat=44.34}&lon=10.99&cnt=7&appid=${apiKey}`;
//   const timestamp = new Date(date).getTime() / 1000;
//   // const currentTimeStampe = Date.now()

//   const fetchWeather = async () => {
//     try {
//       const response = await axios.get(url);
//       console.log(response)
//       const dailyForecasts = response.data.list;

//       // Find the forecast for the specific day
//       const specificDayForecast = dailyForecasts.find(day =>
//         Math.abs(day.dt - timestamp) < 86400); // 86400 seconds = 1 day

//       if (specificDayForecast) {
//         console.log(specificDayForecast)
//         setWeatherData(specificDayForecast);
//       } else {
//         console.log("Forecast for the specific day not found.");
//       }
//     } catch (error) {
//       console.error("Error fetching weather data:", error);
//     }
//   };
