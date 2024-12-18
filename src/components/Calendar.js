"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Image from "next/image";
import { clss } from "@/utils/clss";

export function Calendar({ props, apiKey }) {
  const [weatherData, setWeatherData] = useState({});
  const [coordinates, setCoordinates] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (props?.coord) {
      setCoordinates({
        lat: props.coord.lat,
        lon: props.coord.lon,
      });
    }
  }, [props]);

  useEffect(() => {
    if (!coordinates) return;

    const fetchWeatherData = async () => {
      const startDate = new Date();
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 12, 0);

      try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
        const { data } = await axios.get(url);

        const groupedForecasts = data.list.reduce((acc, forecast) => {
          const forecastDate = new Date(forecast.dt * 1000);

          if (forecastDate < startDate || forecastDate > endDate) return acc;

          const dateKey = `${forecastDate.getFullYear()}-${forecastDate.getMonth() + 1}-${forecastDate.getDate()}`;

          if (!acc[dateKey]) {
            acc[dateKey] = {
              temp: { max: -Infinity, min: Infinity },
              weather: null,
            };
          }

          acc[dateKey].temp.max = Math.max(acc[dateKey].temp.max, forecast.main.temp_max);
          acc[dateKey].temp.min = Math.min(acc[dateKey].temp.min, forecast.main.temp_min);

          if (!acc[dateKey].weather || forecast.weather[0].main !== "Clear") {
            acc[dateKey].weather = forecast.weather[0];
          }

          return acc;
        }, {});

        setWeatherData(groupedForecasts);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeatherData();
  }, [coordinates, apiKey]);

  const renderCalendar = useMemo(() => {
    const currentDate = new Date();

    return Array.from({ length: 12 }, (_, i) => {
      const forecastDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + i);
      const year = forecastDate.getFullYear();
      const month = forecastDate.getMonth();

      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const firstDayOfMonth = new Date(year, month, 1).getDay();
      const lastDayOfPrevMonth = new Date(year, month, 0).getDate();

      const dates = [];

      for (let j = 0; j < firstDayOfMonth; j++) {
        dates.push({
          day: lastDayOfPrevMonth - firstDayOfMonth + j + 1,
          isPrevMonth: true,
          weatherIcon: null,
          weatherDesc: "Unknown",
          temp: { max: null, min: null },
        });
      }

      for (let j = 1; j <= daysInMonth; j++) {
        const dateKey = `${year}-${month + 1}-${j}`;
        const dayForecast = weatherData[dateKey];

        dates.push({
          day: j,
          isPrevMonth: false,
          weatherIcon: dayForecast?.weather
            ? `https://openweathermap.org/img/wn/${dayForecast.weather.icon}@2x.png`
            : null,
          weatherDesc: dayForecast?.weather?.description || "No forecast",
          temp: {
            max: dayForecast?.temp?.max ? Math.round(dayForecast.temp.max) : null,
            min: dayForecast?.temp?.min ? Math.round(dayForecast.temp.min) : null,
          },
        });
      }

      for (let j = 1; j <= 42 - dates.length; j++) {
        dates.push({
          day: j,
          isPrevMonth: true,
          weatherIcon: null,
          weatherDesc: "Unknown",
          temp: { max: null, min: null },
        });
      }

      return (
        <div key={`${year}-${month}`} className={activeTab === i ? "block" : "hidden"}>
          <div className="rounded-xl bg-gray-900/5 my-5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl lg:p-4">
            <div className="rounded-md shadow-lg ring-1 ring-gray-900/10 bg-white/5 px-3.5 overflow-hidden">
              <div className="grid grid-cols-7 gap-1.5 py-1.5">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center font-semibold text-sm py-2.5">
                    <h4>{day}</h4>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1.5 pb-3.5">
                {dates.map((dateObj, index) => (
                  <div
                    key={index}
                    className={clss(
                      dateObj.isPrevMonth ? "text-white/50" : "text-white",
                      "relative rounded-lg p-2"
                    )}
                  >
                    <span className="text-sm font-medium">{dateObj.day}</span>
                    <div className="flex text-sm">
                      {dateObj.weatherIcon ? (
                        <Image
                          src={dateObj.weatherIcon}
                          alt={dateObj.weatherDesc}
                          width={80}
                          height={80}
                          className="object-contain"
                        />
                      ) : (
                        <div className="flex items-center justify-center text-xs w-20 h-20 text-white/50">
                          Unknown
                        </div>
                      )}
                      {dateObj.temp?.max !== null && dateObj.temp?.min !== null ? (
                        <div className="flex flex-col justify-center items-center space-y-2 text-lg text-white font-medium">
                          <span>{dateObj.temp.max}°</span>
                          <span>{dateObj.temp.min}°</span>
                        </div>
                      ) : (
                        <div className="text-xs text-white/50 mt-1">Unknown</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    });
  }, [weatherData, activeTab]);

  const renderMonthTabs = useMemo(() => {
    return Array.from({ length: 12 }, (_, index) => {
      const forecastDate = new Date(
        new Date().getFullYear(),
        new Date().getMonth() + index
      );
      
      const monthName = forecastDate.toLocaleString("en-US", { month: "long" });
      return (
        <button
          key={index}
          onClick={() => setActiveTab(index)}
          className={clss(
              "px-3 py-2 text-white",
              activeTab === index ? "bg-white/10 ring-1 ring-white/15 rounded" : ""
            )
          }
        >
          {monthName.slice(0, 3)}
        </button>
      );
    });
  }, [activeTab]);

  return (
    <div>
      <div className="grid grid-cols-12 p-1.5 bg-white/5 ring-1 ring-white/10 rounded-lg shadow-sm backdrop-blur-sm">
        {renderMonthTabs}
      </div>

      <div>{renderCalendar}</div>
    </div>
  );
}
