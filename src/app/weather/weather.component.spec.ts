import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherComponent } from './weather.component';
import { CurrentWeather, WeatherStatus } from '../models/weather.model';
import { CityData } from '../models/search.model';

describe('WeatherComponent', () => {
  let fixture: ComponentFixture<WeatherComponent>;
  let component: WeatherComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WeatherComponent);
    component = fixture.componentInstance;
  });

  it('should update weatherIcon based on weatherData', () => {
    const mockWeatherData: CurrentWeather = {
      temperature: 25,
      weathercode: 1,
      windspeed: 0,
    };

    const mockCityData: CityData = {
      display_name: 'Test City',
      lat: '0',
      lon: '0',
    };

    fixture.componentRef.setInput('weatherData', mockWeatherData);
    fixture.componentRef.setInput('cityData', mockCityData);

    fixture.detectChanges();

    expect(component.weatherIcon()).toBe('⛅');
    expect(component.weatherConditions()).toBe(WeatherStatus.PartlyCloudy.description);
  });
});
