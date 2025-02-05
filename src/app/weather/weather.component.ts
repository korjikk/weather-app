import { Component, computed, effect, input, signal } from '@angular/core';

import { CurrentWeather, WeatherStatus } from '../models/weather.model';
import { CityData } from '../models/search.model';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss',
})
export class WeatherComponent {
  weatherData = input.required<CurrentWeather>();
  cityData = input.required<CityData>();
  weatherIcon = computed(() => this.weatherStatus().icon);
  weatherConditions = computed(() => this.weatherStatus().description);

  private weatherStatus = computed(() => {
    const code = this.weatherData().weathercode;
    return this.getWeatherStatus(code);
  });

  private getWeatherStatus(code: number): { description: string; icon: string } {
    if (code === 0) return WeatherStatus.ClearSky;
    else if (code >= 1 && code <= 3) return WeatherStatus.PartlyCloudy;
    else if ([45, 48].includes(code)) return WeatherStatus.Fog;
    else if (code >= 51 && code <= 57) return WeatherStatus.Drizzle;
    else if (code >= 61 && code <= 67) return WeatherStatus.Rain;
    else if (code >= 71 && code <= 77) return WeatherStatus.Snowfall;
    else if (code >= 80 && code <= 82) return WeatherStatus.Showers;
    else if (code >= 95 && code <= 99) return WeatherStatus.Thunderstorm;
    else return WeatherStatus.Unknown;
  }
}
