import { useState, useEffect } from "react";

import { TiWeatherSunny } from "react-icons/ti";
import { TiWeatherDownpour } from "react-icons/ti";
import { FiSunset } from "react-icons/fi";
import { FiSunrise } from "react-icons/fi";

import { Text } from "@chakra-ui/react";
import { WeatherDataDay } from "../types/types";
import APIService from "../Api-client-service";

import "./weather-component.css";

const WeatherComponent = ({
  lat,
  lon,
  daysFromNow,
}: {
  lat: string;
  lon: string;
  daysFromNow: number;
}) => {
  const [weatherData, setWeatherData] = useState<WeatherDataDay>();

  useEffect(() => {
    console.log(daysFromNow)

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation_probability,rain&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,rain_sum,precipitation_hours,precipitation_probability_max&timezone=GMT`;

    APIService.fetchWeather(url).then(
      (dailyForecasts: WeatherDataDay | undefined) => {
        if (dailyForecasts) {
          setWeatherData(dailyForecasts);
        }
      },
    );
  }, [lat, lon]);

  if (!weatherData) return <div>Loading...</div>;

  return (
    <div className="weather-container">
      <div className="weather-icon-container">
        {weatherData?.precipitation_probability_max[daysFromNow] > 50 ? (
          <TiWeatherDownpour size="4rem" />
        ) : (
          <TiWeatherSunny size="4rem" />
        )}
      </div>
      <p>
        {" "}
        {(
          (weatherData?.temperature_2m_max[daysFromNow] +
            weatherData?.temperature_2m_min[daysFromNow]) /
          2
        ).toFixed()}
        °C
      </p>
      <p>
        Chance of Rain:{" "}
        {weatherData?.precipitation_probability_max[daysFromNow]}%{" "}
      </p>
      <div className="sunrise-sunset-container">
        <FiSunrise size="20px" />
        <Text>{weatherData?.sunrise[daysFromNow].slice(-5)}</Text>
        <FiSunset size="20px" />
        <Text>{weatherData?.sunset[daysFromNow].slice(-5)}</Text>
      </div>
    </div>
  );
};

export default WeatherComponent;
