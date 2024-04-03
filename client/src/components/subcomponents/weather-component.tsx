import { useState, useEffect } from "react";
import {
  TiWeatherSunny,
  TiWeatherDownpour,
  TiWeatherCloudy,
  TiWeatherPartlySunny,
  TiWeatherShower,
  TiWeatherSnow,
  TiWeatherStormy
} from "react-icons/ti";

import {
  TbCircleArrowDown,
  TbCircleArrowDownLeft,
  TbCircleArrowDownRight,
  TbCircleArrowLeft,
  TbCircleArrowRight,
  TbCircleArrowUp,
  TbCircleArrowUpLeft,
  TbCircleArrowUpRight
} from "react-icons/tb";

import { FiSunset } from "react-icons/fi";
import { FiSunrise } from "react-icons/fi";

import { Text, Box, Icon } from "@chakra-ui/react";
import { WeatherDataDay } from "../../types/types";
import APIService from "../../Api-client-service";

const WeatherComponent = ({
  lat,
  lon,
  daysFromNow,
  fullWeatherComponentFlag,
}: {
  lat: string;
  lon: string;
  daysFromNow: number;
  fullWeatherComponentFlag: boolean;
}) => {
  const [weatherData, setWeatherData] = useState<WeatherDataDay>();

  const weatherCodes: { [key: number]: JSX.Element } = {
    0: <TiWeatherSunny size="4rem" />,
    1: <TiWeatherPartlySunny size="4rem" />,
    2: <TiWeatherCloudy size="4rem" />,
    3: <TiWeatherCloudy size="4rem" />,
    45: <TiWeatherShower size="4rem" />,
    48: <TiWeatherShower size="4rem" />,
    51: <TiWeatherShower size="4rem" />,
    53: <TiWeatherShower size="4rem" />,
    55: <TiWeatherDownpour size="4rem" />,
    56: <TiWeatherShower size="4rem" />,
    57: <TiWeatherDownpour size="4rem" />,
    61: <TiWeatherShower size="4rem" />,
    63: <TiWeatherShower size="4rem" />,
    65: <TiWeatherDownpour size="4rem" />,
    71: <TiWeatherSnow size="4rem" />,
    73: <TiWeatherSnow size="4rem" />,
    75: <TiWeatherSnow size="4rem" />,
    77: <TiWeatherSnow size="4rem" />,
    80: <TiWeatherShower size="4rem" />,
    81: <TiWeatherDownpour size="4rem" />,
    82: <TiWeatherStormy size="4rem" />,
    85: <TiWeatherSnow size="4rem" />,
    86: <TiWeatherSnow size="4rem" />,
  }

  // from an input between 0 360 return the corresponding arrow icon

  const windDirectionToIcon = (direction: number): JSX.Element => {
    if (direction >= 0 && direction < 22.5) {
      return <TbCircleArrowUp />
    }
    if (direction >= 22.5 && direction < 67.5) {
      return <TbCircleArrowUpRight />
    }
    if (direction >= 67.5 && direction < 112.5) {
      return <TbCircleArrowRight />
    }
    if (direction >= 112.5 && direction < 157.5) {
      return <TbCircleArrowDownRight />
    }
    if (direction >= 157.5 && direction < 202.5) {
      return <TbCircleArrowDown />
    }
    if (direction >= 202.5 && direction < 247.5) {
      return <TbCircleArrowDownLeft />
    }
    if (direction >= 247.5 && direction < 292.5) {
      return <TbCircleArrowLeft />
    }
    if (direction >= 292.5 && direction < 337.5) {
      return <TbCircleArrowUpLeft />
    }
    if (direction >= 337.5 && direction <= 360) {
      return <TbCircleArrowUp />
    }
    return <TbCircleArrowUp />
  }

  useEffect(() => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation_probability,rain&daily=weather_code,wind_speed_10m_max,wind_direction_10m_dominant,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,rain_sum,precipitation_hours,precipitation_probability_max&timezone=GMT`;
    APIService.fetchWeather(url).then(
      (dailyForecasts: WeatherDataDay | undefined) => {
        if (dailyForecasts) {
          setWeatherData(dailyForecasts);
        }
      },
    );
  }, [lat, lon]);

  if (!weatherData) return null

  return (
    <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" height="100%">
      <Box display="flex" justifyContent="center">
        {
          weatherCodes[weatherData?.weather_code[daysFromNow]] ? weatherCodes[weatherData?.weather_code[daysFromNow]]
            : <TiWeatherCloudy size="4rem" />
        }
      </Box>
      <Text>
        {weatherData?.precipitation_sum[daysFromNow]}mm rain ({weatherData?.precipitation_probability_max[daysFromNow]}%)
      </Text>
      <Box>
        <Text>
          {" "}
          {(
            (weatherData?.temperature_2m_max[daysFromNow] +
              weatherData?.temperature_2m_min[daysFromNow]) /
            2
          ).toFixed()} °C
        </Text>
      </Box>
      {fullWeatherComponentFlag && (
        <>
          <Box display="flex" justifyContent="center" alignItems="center" gap="10px">
            <Text>
              {weatherData?.wind_speed_10m_max[daysFromNow]}km/s{" "}
            </Text>
            <Box>
              {windDirectionToIcon(weatherData?.wind_direction_10m_dominant[daysFromNow])}
            </Box>
          </Box>
          <Box display="flex" justifyContent="space-evenly" alignItems="center" height="100%" gap="1rem">
            <Icon as={FiSunrise} boxSize="20px" />
            <Text>{weatherData?.sunrise[daysFromNow].slice(-5)}</Text>
            <Icon as={FiSunset} boxSize="20px" />
            <Text>{weatherData?.sunset[daysFromNow].slice(-5)}</Text>
          </Box>
        </>
      )}
    </Box>
  );
};

export default WeatherComponent;
