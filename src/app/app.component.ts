import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { catchError, debounceTime, distinctUntilChanged, EMPTY, filter, switchMap, tap } from 'rxjs';

import { HeaderComponent } from './layout/header/header.component';
import { WeatherComponent } from './weather/weather.component';
import { WeatherService } from './core/weather.service';
import { SearchService } from './core/search.service';
import { CurrentWeather } from './models/weather.model';
import { CityData } from './models/search.model';



@Component({
  selector: 'app-root',
  imports: [HeaderComponent, WeatherComponent, ReactiveFormsModule],
  providers: [WeatherService, SearchService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(private weatherService: WeatherService, private searchService: SearchService) {}

  cityData: CityData | null = null;
  weatherData: CurrentWeather | null = null;
  error: string | null = null;
  searchControl = new FormControl('');

  ngOnInit() {
    // not unsubscribing from the searchControl because currently this is the only page of the app
    this.searchControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      filter((city: string | null): city is string => city !== null),
      tap(() => {
        this.error = null;
      }),
      switchMap((city: string) =>
        this.searchService.searchCity(city).pipe(
          switchMap((results: CityData[]) => {
            if (results && results.length > 0) {
              this.cityData = results[0];
              const lat = parseFloat(this.cityData.lat);
              const lon = parseFloat(this.cityData.lon);
 
              return this.weatherService.getWeather(lat, lon).pipe(
                tap((weatherResponse) => {
                  this.weatherData = weatherResponse;
                }),
                catchError(() => {
                  this.error = 'Weather data could not be retrieved.';
                  return EMPTY;
                })
              );
            } else {
              this.error = 'City not found.';
              this.cityData = null;
              this.weatherData = null;
              return EMPTY;
            }
          }),
          catchError(() => {
            this.error = 'Error searching for city.';
            return EMPTY;
          })
        )
      )
    ).subscribe();
  }
}
