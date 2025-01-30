# Weather Dashboard

A beautiful and responsive weather dashboard application built with React, TypeScript, and Tailwind CSS.

## Features

- Search for weather by city name
- Display current weather conditions
- Show temperature, humidity, and wind speed
- Recent searches history
- Responsive design
- Dark mode support
- Error handling
- Loading states

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- TanStack Query
- Zustand
- Vitest & React Testing Library
- OpenWeather API

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and add your OpenWeather API key:
   ```bash
   VITE_OPENWEATHER_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Testing

Run the test suite:

```bash
npm test
```

## Building for Production

```bash
npm run build
```

## Components
- Weather
  - Logo
  - Search
  - CurrentWeather
  - WeatherCard
    - WeatherDetails
    - HourlyWeather
      - HourlyWeatherList