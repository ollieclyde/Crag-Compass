import axios from "axios";
import { Crag, WeatherDataDay } from "./types/types";

const getAllCrags = async (
  lng: string,
  lat: string,
  maxDist: number[],
): Promise<Crag[] | undefined> => {
  try {
    const allCrags = await axios.get(
      `http://localhost:3000/crags/${lng}/${lat}/${maxDist}`,
    );
    return allCrags.data;
  } catch (err) {
    console.error("Error posting data to the server:", err);
  }
};

const fetchWeather = async (
  url: string,
): Promise<WeatherDataDay | undefined> => {
  try {
    const response = await axios.get(url);
    const dailyForecasts: WeatherDataDay = response.data.daily;
    if (dailyForecasts) {
      return dailyForecasts;
    } else {
      console.log("Forecast for the specific day not found.");
      return undefined;
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
};

export default { fetchWeather, getAllCrags };
