import express, { Request, Response } from "express";

const router = express.Router();

const WEATHER_API_KEY =
  process.env.WEATHER_API_KEY || "4304101acf05457f90f93638251307";

interface WeatherAPIResponse {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    localtime: string;
    tz_id: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
  };
}

interface ForecastAPIResponse {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    localtime: string;
    tz_id: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
  };
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        avgtemp_c: number;
        condition: {
          text: string;
          icon: string;
          code: number;
        };
      };
    }>;
  };
}

router.get("/current", async (req: Request, res: Response) => {
  try {
    const { lat, lon, useIP } = req.query;

    let locationQuery: string;

    if (lat && lon) {
      // Use provided coordinates
      locationQuery = `${lat},${lon}`;
    } else if (useIP === "true") {
      // Use IP-based location as fallback
      locationQuery = "auto:ip";
    } else {
      return res.status(400).json({
        message:
          "Either latitude/longitude coordinates or useIP=true is required",
      });
    }

    // Fetch weather data from WeatherAPI.com
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${locationQuery}&aqi=no`
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data: WeatherAPIResponse = await response.json();

    const weatherData = {
      temperature: Math.round(data.current.temp_c),
      condition: data.current.condition.text.toLowerCase(),
      location: data.location.name,
      icon: data.current.condition.icon,
      conditionCode: data.current.condition.code,
    };

    res.status(200).json(weatherData);
  } catch (error) {
    console.error("Error fetching weather:", error);
    res.status(500).json({
      message: "Failed to fetch weather data",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.get("/forecast", async (req: Request, res: Response) => {
  try {
    const { lat, lon, useIP } = req.query;

    let locationQuery: string;

    if (lat && lon) {
      // Use provided coordinates
      locationQuery = `${lat},${lon}`;
    } else if (useIP === "true") {
      // Use IP-based location as fallback
      locationQuery = "auto:ip";
    } else {
      return res.status(400).json({
        message:
          "Either latitude/longitude coordinates or useIP=true is required",
      });
    }

    // Fetch 4-day forecast data from WeatherAPI.com (today + next 3 days)
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${locationQuery}&days=4&aqi=no`
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data: ForecastAPIResponse = await response.json();

    const forecastData = {
      current: {
        temperature: Math.round(data.current.temp_c),
        condition: data.current.condition.text.toLowerCase(),
        conditionCode: data.current.condition.code,
        icon: data.current.condition.icon,
      },
      location: data.location.name,
      forecast: data.forecast.forecastday.map((day) => ({
        date: day.date,
        maxTemp: Math.round(day.day.maxtemp_c),
        minTemp: Math.round(day.day.mintemp_c),
        avgTemp: Math.round(day.day.avgtemp_c),
        condition: day.day.condition.text.toLowerCase(),
        conditionCode: day.day.condition.code,
        icon: day.day.condition.icon,
      })),
    };

    res.status(200).json(forecastData);
  } catch (error) {
    console.error("Error fetching forecast:", error);
    res.status(500).json({
      message: "Failed to fetch forecast data",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.get("/search", async (req: Request, res: Response) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== "string") {
      return res.status(400).json({
        message: "City name (q) is required",
      });
    }

    // Fetch weather data for the searched city
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(
        q
      )}&aqi=no`
    );

    if (!response.ok) {
      if (response.status === 400) {
        return res.status(400).json({
          message: "City not found. Please check the spelling and try again.",
        });
      }
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data: WeatherAPIResponse = await response.json();

    const weatherData = {
      temperature: Math.round(data.current.temp_c),
      condition: data.current.condition.text.toLowerCase(),
      location: data.location.name,
      country: data.location.country,
      timezone: data.location.tz_id,
      localTime: data.location.localtime,
      icon: data.current.condition.icon,
      conditionCode: data.current.condition.code,
    };

    res.status(200).json(weatherData);
  } catch (error) {
    console.error("Error searching weather:", error);
    res.status(500).json({
      message: "Failed to search weather data",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.get("/search-forecast", async (req: Request, res: Response) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== "string") {
      return res.status(400).json({
        message: "City name (q) is required",
      });
    }

    // Fetch 5-day forecast data for the searched city (today + next 4 days)
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(
        q
      )}&days=5&aqi=no`
    );

    if (!response.ok) {
      if (response.status === 400) {
        return res.status(400).json({
          message: "City not found. Please check the spelling and try again.",
        });
      }
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data: ForecastAPIResponse = await response.json();

    const forecastData = {
      location: data.location.name,
      country: data.location.country,
      timezone: data.location.tz_id,
      localTime: data.location.localtime,
      // Skip the first day (today) and take the next 3 days (index 1, 2, 3)
      forecast: data.forecast.forecastday.slice(1, 4).map((day) => ({
        date: day.date,
        maxTemp: Math.round(day.day.maxtemp_c),
        minTemp: Math.round(day.day.mintemp_c),
        avgTemp: Math.round(day.day.avgtemp_c),
        condition: day.day.condition.text.toLowerCase(),
        conditionCode: day.day.condition.code,
        icon: day.day.condition.icon,
      })),
    };

    res.status(200).json(forecastData);
  } catch (error) {
    console.error("Error searching forecast:", error);
    res.status(500).json({
      message: "Failed to search forecast data",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
