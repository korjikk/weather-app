export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  weathercode: number;
}

export const WeatherStatus = {
  ClearSky: { description: 'Clear sky', icon: '🔆' },
  PartlyCloudy: { description: 'Partly cloudy', icon: '⛅' },
  Fog: { description: 'Fog', icon: '🌫' },
  Drizzle: { description: 'Drizzle', icon: '🌧' },
  Rain: { description: 'Rain', icon: '🌧' },
  Snowfall: { description: 'Snowfall', icon: '🌨' },
  Showers: { description: 'Showers', icon: '🌦' },
  Thunderstorm: { description: 'Thunderstorm', icon: '⛈️' },
  Unknown: { description: 'Unknown', icon: '❓' },
} as const;
