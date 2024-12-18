import { Geist, Geist_Mono } from "next/font/google";
import { useState, useEffect } from "react";
import { Wind, Droplet, Thermometer, MapPin, SunIcon, Eye, Gauge, XIcon } from "lucide-react";
import axios from "axios";
import Image from "next/image";

import { Calendar } from "@/components/Calendar";
import { Search } from "@/components/Search";
import { Footer } from "@/components/Footer";
import { Clouds } from "@/components/Clouds";
import { Heading } from "@/components/Heading";
import { Card, Section } from "@/components/Section";

import { clss } from "@/utils/clss";
import { BACKGROUND_COLORS, CLOUD_COLORS } from "@/utils/theme";
import { greetingPeriod, determineTimePeriod } from "@/utils/period";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [weatherData, setWeatherData] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [dailyForecast, setDailyForecast] = useState([]);
  const [searchCity, setSearchCity] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [backgroundTheme, setBackgroundTheme] = useState("");
  const [searching, setSearching] = useState("");

  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

  const getWeatherIcon = (icon) => {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  };

  useEffect(() => {
    const currentHour = currentTime.getHours();
    const period = determineTimePeriod(currentHour);

    const themePeriod = period.toLowerCase().replace(/^\w/, (c) => c.toLowerCase());
    setBackgroundTheme(themePeriod);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherData(latitude, longitude);
      });
    }
  }, []);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      const now = currentTime;
      setCurrentTime(now);

      const currentHour = now.getHours();
      const period = determineTimePeriod(currentHour);

      const themePeriod = period.toLowerCase().replace(/^\w/, (c) => c.toLowerCase());
      setBackgroundTheme(themePeriod);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  const fetchWeatherData = async (lat, lon, city = null) => {
    try {
      const weatherUrl = city ? `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric` : `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
      const forecastUrl = city ? `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric` : `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

      const [weatherResponse, forecastResponse] = await Promise.all([
        axios.get(weatherUrl),
        axios.get(forecastUrl),
      ]);

      setSearching("");

      const isRaining = weatherResponse.data.weather[0].main.toLowerCase().includes("rain");
      if (isRaining) {
        setBackgroundTheme("rain");
      }

      setWeatherData({
        ...weatherResponse.data,
        visibility: weatherResponse.data.visibility / 1000,
      });

      processForecastData(forecastResponse.data);
      setSearchCity("");
    } catch (error) {
      console.error("Error fetching weather data:", error);

      if (error.response?.status === 404) {
        setSearchError("City not found");
        setSearchCity("");
      }
    }
  };

  const processForecastData = (forecastData) => {
    const hourlyData = forecastData.list.slice(0, 12).map((hour) => ({
      time: new Date(hour.dt * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      temp: Math.round(hour.main.temp),
      icon: getWeatherIcon(hour.weather[0].icon),
    }));

    const dailyData = forecastData.list
      .filter((_, index) => index % 4 === 0)
      .slice(0, 10)
      .map((day) => ({
        date: new Date(day.dt * 1000).toLocaleDateString([], {
          weekday: "short",
        }),
        tempMax: Math.round(day.main.temp_max),
        tempMin: Math.round(day.main.temp_min),
        icon: getWeatherIcon(day.weather[0].icon),
      }));

    setHourlyForecast(hourlyData);
    setDailyForecast(dailyData);
  };

  const handleCitySearch = () => {
    if (searchCity) {
      fetchWeatherData(null, null, searchCity);
    }
  };

  if (!weatherData) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-white" style={{ background: BACKGROUND_COLORS[backgroundTheme] }}>
        <SunIcon size={64} className="animate-spin" />
        <p className="text-lg my-5 tracking-widest">LOADING...</p>
      </div>
    );
  }

  const currentWeatherIcon = getWeatherIcon(weatherData.weather[0].icon);
  const formatTime = `${currentTime.getHours() % 12 || 12}:${currentTime.getMinutes().toString().padStart(2, "0")}`;

  return (
    <>
      <Heading />

      <main className={clss( geistSans.variable, geistMono.variable, "font-[family-name:var(--font-geist-sans)] antialiased")}>
        <div className="transition-all duration-1000 ease-linear relative isolate text-white py-4 min-h-screen" style={{ background: BACKGROUND_COLORS[backgroundTheme] }}>
          <Clouds color={CLOUD_COLORS[backgroundTheme]} />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Search
              greeting={greetingPeriod(currentTime.getHours())}
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              onClick={handleCitySearch}
            />

            {searching && (
              <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
                {searching}
                <button onClick={() => setSearchError("")} className="ml-4 text-white hover:text-gray-200">
                  <XIcon size={24} />
                </button>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6 my-10">
              <div className="bg-white/5 ring-1 ring-white/10 shadow-sm rounded-lg p-8 backdrop-blur-sm">
                <div className="flex flex-col items-start space-x-3.5">
                  <div className="inline-flex space-x-4">
                    <div>
                      <MapPin size={36} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">
                        {weatherData.name}, {weatherData.sys.country}
                      </h2>
                      <div className="inline-flex items-center space-x-2 text-gray-100">
                        <p>
                          {currentTime.getDate()}{" "}
                          {currentTime.toLocaleString("en-US", { month: "long" })}{" "}
                          {currentTime.getFullYear()}
                        </p>
                        <svg width={3} height={3} viewBox="0 0 2 2" aria-hidden="true" className="fill-gray-100">
                          <circle r={1} cx={1} cy={1} />
                        </svg>
                        <p>
                          {formatTime}{" "}
                          {currentTime.getHours() >= 12 ? "PM" : "AM"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 mt-4">
                    <Image src={currentWeatherIcon} alt="Weather icon" width={112} height={112} />
                    <div>
                      <p className="text-6xl font-bold">
                        {Math.round(weatherData.main.temp)}
                        <span className="text-2xl font-medium align-top">°C</span>
                      </p>
                      <p className="text-xl capitalize mt-1.5">
                        {weatherData.weather[0].description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6 bg-white/5 ring-1 ring-white/10 shadow-sm rounded-lg p-8 backdrop-blur-sm">
                <Card title="Wind">
                  <Wind size={24} />
                  <p>{weatherData.wind.speed} m/s</p>
                </Card>
                <Card title="Humidity">
                  <Droplet size={24} />
                  <p>{weatherData.main.humidity}%</p>
                </Card>
                <Card title="Feels Like">
                  <Thermometer size={24} />
                  <p>
                    {Math.round(weatherData.main.feels_like)}
                    <span className="text-[9px] font-medium align-top ml-0.5">°C</span>
                  </p>
                </Card>
                <Card title="Visibility">
                  <Eye size={24} />
                  <p>{weatherData.visibility} km</p>
                </Card>
                <Card title="Pressure">
                  <Gauge size={24} />
                  <p>{weatherData.main.pressure} hPa</p>
                </Card>
              </div>
            </div>

            <Section title="Hourly Forecast">
              {hourlyForecast.map((hour, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 text-center p-3.5 bg-white/5 ring-1 ring-white/10 shadow-sm backdrop-blur-sm rounded-lg"
                >
                  <p>{hour.time}</p>
                  <Image
                    src={hour.icon}
                    alt="Hourly forecast icon"
                    className="mx-auto my-3"
                    width={48}
                    height={48}
                  />
                  <p>
                    {hour.temp}
                    <span className="text-[9px] font-medium align-top ml-0.5">°C</span>
                  </p>
                </div>
              ))}
            </Section>

            <Section title="10-Day Forecast">
              {dailyForecast.map((day, index) => (
                <div
                  key={index}
                  className="flex flex-1 gap-x-6 items-end text-center py-3.5 bg-white/5 ring-1 ring-white/10 shadow-sm backdrop-blur-sm rounded-lg"
                >
                  <div className="text-start shrink-0">
                    <h5 className="text-gray-200 px-7">{day.date}</h5>
                    <Image
                      src={day.icon}
                      alt="Daily weather icon"
                      className="mx-auto my-2"
                      width={48}
                      height={48}
                    />
                  </div>
                  <div className="flex flex-col gap-y-2 pr-7">
                    <span>{day.tempMax}°</span>
                    <span>{day.tempMin}°</span>
                  </div>
                </div>
              ))}
            </Section>

            <div className="custom-scrollbar mt-14 whitespace-nowrap w-full overflow-x-auto">
              <h3 className="text-xl font-semibold mb-5">Monthly Calendar</h3>
              <div className="w-[1192px]">
                <Calendar props={weatherData} apiKey={API_KEY} />
              </div>
            </div>

            <Footer time={currentTime.getFullYear()} />
          </div>
        </div>
      </main>
    </>
  );
}
