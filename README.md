# Weather Forecast App

A modern, responsive weather forecast application built with React, TypeScript, and Vite. Search for any city worldwide to get real-time weather conditions with a beautiful, weather-adaptive UI.

## Features

- **Real-time Weather Data**: Fetches current weather conditions using OpenWeatherMap API
- **City Search**: Search for any city worldwide using geocoding
- **Dynamic Theming**: Background gradient changes based on weather conditions (sunny, rainy, snowy, cloudy)
- **Smart Caching**: 10-minute cache for weather data to reduce API calls
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - UI component library
- **Lucide React** - Icons
- **OpenWeatherMap API** - Weather data
- **Nominatim API** - Geocoding

## Prerequisites

- Node.js (v20 or higher recommended)
- npm
- OpenWeatherMap API key (free tier available)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd weather-report-test-task
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file and add your OpenWeatherMap API key:

```env
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

**To get your API key:**

1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Go to the "API keys" section in your account
3. Copy your API key
4. Note: This app uses the One Call API 3.0, which requires a subscription (free tier available)

### 4. Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   └── weather/         # Weather app components
│       ├── WeatherApp.tsx
│       ├── WeatherCard.tsx
│       ├── SearchForm.tsx
│       ├── LoadingSpinner.tsx
│       └── ErrorMessage.tsx
├── hooks/
│   └── useWeather.ts    # Weather data hook
├── services/
│   └── weatherApi.ts    # API service layer
├── types/
│   └── weather.ts       # TypeScript types
├── lib/
│   └── utils.ts         # Utility functions
├── App.tsx              # Root component
└── main.tsx             # Entry point
```
