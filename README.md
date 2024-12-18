# Weather Forecast

A modern Weather Forecast application built with [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), and the [OpenWeatherMap API](https://openweathermap.org/). This project provides accurate and detailed weather forecasts, Search for cities with accurate names like the original. including a **calendar view** for planning ahead. It features a sleek and responsive design optimized for all device sizes, ensuring a seamless user experience.

## Features

1. **10-Day Weather Forecast**: View accurate weather predictions for the week ahead.
2. **Calendar View**: Intuitive and easy-to-navigate calendar interface for checking forecasts by date.
3. **Responsive Design**: Optimized for mobile, tablet, and desktop devices.
4. **Real-Time Data**: Fetches up-to-date weather information from the **OpenWeatherMap API**.
5. **Dynamic backgrounds**. The background color changes every **6 times** (Dawn, Morning, Noon, Afternoon, Evening and Night) and **rainy weather**.
6. **Modern Tech Stack**: Built using **Next.js** for server-side rendering and **Tailwind CSS** for streamlined styling.
7. **Customizable**: Easily adapt the design and features to suit your needs.

## How Does It Work?

This weather application leverages the **OpenWeatherMap API** to retrieve weather data for a selected location. Users can explore weather details for the current day or use the interactive calendar to view forecasts. It provides the following information:

- **Current Weather**: Temperature, humidity, wind speed, and weather conditions.
- **10-Day Forecast**: Daily high and low temperatures, as well as expected weather conditions.
- **Location Search**: Search your city or towns with the exact same name as the original to get the local weather forecast.

## Screenshot

![preview](https://github.com/user-attachments/assets/c01fb3e0-ebb9-4da1-8cac-980f6b35daf1)

## Installation

Follow the steps below to set up the project locally:

```bash
# Clone the repository
git clone https://github.com/ryzmdn/weather-forecast.git

# Change into the project directory
cd weather-forecast

# Install dependencies
npm install

# Open the code editor
code .

# Run the development server
npm run dev
```

## Usage

Once the development server is running, you can access the application at `http://localhost:3000`. Customize the app to match your preferences:

1. Set API Key:
    - Sign up at [OpenWeatherMap](https://openweathermap.org/) to get a free API key.
    - Add your API key to the `.env` file:
    - ```env NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here```
2. Modify Location Options:
    - Edit the default locations in the src/data/locations.ts file.

3. Tailwind CSS Styling:
    - Customize styles in the `src/styles` directory to fit your brand.

## Customization

- **Add Features**: Extend functionality by integrating additional weather metrics such as UV index or air quality.
- **Update UI**: Modify the components in the src/components directory to match your design preferences.
- **Deploy**: Host the project on platforms like Vercel, Netlify, or any other service that supports Next.js.

## Support

For any issues or inquiries, please email `riybuzniz@gmail.com`.

## Feedback

We welcome your feedback! Feel free to share your suggestions or report bugs by reaching out at `riybuzniz@gmail.com`.

## License

This project is licensed under the **MIT License**. You are free to use, modify, and distribute it for personal or commercial purposes.
