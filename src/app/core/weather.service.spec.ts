// src/app/core/weather.service.spec.ts
import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { WeatherService } from './weather.service';
import { CurrentWeather } from '../models/weather.model';
import { environment } from '../../environments/environment.development';


describe('WeatherService', () => {
  let service: WeatherService;
  let httpMock: HttpTestingController;

  const dummyWeather: CurrentWeather = {
    temperature: 15,
    windspeed: 10,
    weathercode: 0,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WeatherService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(WeatherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch weather data and map response correctly', () => {
    const lat = 51.5074;
    const lon = -0.1278;
    const expectedUrl = `${environment.weatherUrl}?latitude=${lat}&longitude=${lon}&current_weather=true`;

    service.getWeather(lat, lon).subscribe((weather: CurrentWeather) => {
      expect(weather).toEqual(dummyWeather);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush({ current_weather: dummyWeather });
  });
});
