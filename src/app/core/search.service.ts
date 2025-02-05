import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { CityData } from '../models/search.model';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private http: HttpClient) {}

  searchCity(city: string): Observable<CityData[]> {
    const url = `${environment.searchUrl}?q=${city}&format=json`;
    return this.http.get<CityData[]>(url);
  }
}
