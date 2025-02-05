import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, map } from 'rxjs';

import { environment } from '../../environments/environment.development';
import { CurrentWeather } from '../models/weather.model';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  constructor(private http: HttpClient) {}

  getWeather(lat: number, lon: number): Observable<CurrentWeather> {
    const url = `${environment.weatherUrl}?latitude=${lat}&longitude=${lon}&current_weather=true`;
    return this.http
      .get<{ current_weather: CurrentWeather }>(url)
      .pipe(map((response) => response.current_weather));
  }
}
