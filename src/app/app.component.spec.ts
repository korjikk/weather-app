import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { AppComponent } from './app.component';
import { WeatherService } from './core/weather.service';
import { SearchService } from './core/search.service';
import { CurrentWeather } from './models/weather.model';
import { CityData } from './models/search.model';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockWeatherService: jasmine.SpyObj<WeatherService>;
  let mockSearchService: jasmine.SpyObj<SearchService>;

  beforeEach(async () => {
    mockWeatherService = jasmine.createSpyObj('WeatherService', ['getWeather']);
    mockSearchService = jasmine.createSpyObj('SearchService', ['searchCity']);

    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
    TestBed.overrideProvider(WeatherService, { useValue: mockWeatherService });
    TestBed.overrideProvider(SearchService, { useValue: mockSearchService });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should update weatherData when a valid city is searched', fakeAsync(() => {
    const mockCityData: CityData = {
      display_name: 'Test City',
      lat: '10',
      lon: '20',
    };
    const mockWeatherData: CurrentWeather = {
      weathercode: 1,
      windspeed: 0,
      temperature: 10,
    };

    mockSearchService.searchCity.and.returnValue(of([mockCityData]));
    mockWeatherService.getWeather.and.returnValue(of(mockWeatherData));

    component.searchControl.setValue('Test City');
    tick(500); // Simulate debounceTime

    expect(mockSearchService.searchCity).toHaveBeenCalledWith('Test City');
    expect(mockWeatherService.getWeather).toHaveBeenCalledWith(10, 20);
    expect(component.cityData).toEqual(mockCityData);
    expect(component.weatherData).toEqual(mockWeatherData);
    expect(component.error).toBeNull();
  }));

  it('should set error when city is not found', fakeAsync(() => {
    mockSearchService.searchCity.and.returnValue(of([]));

    component.searchControl.setValue('Unknown City');
    tick(500); // Simulate debounceTime

    expect(mockSearchService.searchCity).toHaveBeenCalledWith('Unknown City');
    expect(component.cityData).toBeNull();
    expect(component.weatherData).toBeNull();
    expect(component.error).toBe('City not found.');
  }));

  it('should set error when search service fails', fakeAsync(() => {
    mockSearchService.searchCity.and.returnValue(
      throwError(() => new Error('Search error'))
    );

    component.searchControl.setValue('Test City');
    tick(500); // Simulate debounceTime

    expect(mockSearchService.searchCity).toHaveBeenCalledWith('Test City');
    expect(component.cityData).toBeNull();
    expect(component.weatherData).toBeNull();
    expect(component.error).toBe('Error searching for city.');
  }));

  it('should set error when weather service fails', fakeAsync(() => {
    const mockCityData: CityData = {
      display_name: 'Test City',
      lat: '10',
      lon: '20',
    };

    mockSearchService.searchCity.and.returnValue(of([mockCityData]));
    mockWeatherService.getWeather.and.returnValue(
      throwError(() => new Error('Weather error'))
    );

    component.searchControl.setValue('Test City');
    tick(500); // Simulate debounceTime

    expect(mockSearchService.searchCity).toHaveBeenCalledWith('Test City');
    expect(mockWeatherService.getWeather).toHaveBeenCalledWith(10, 20);
    expect(component.cityData).toEqual(mockCityData);
    expect(component.weatherData).toBeNull();
    expect(component.error).toBe('Weather data could not be retrieved.');
  }));
});
