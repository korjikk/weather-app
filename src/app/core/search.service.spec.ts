import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { SearchService } from './search.service';
import { CityData } from '../models/search.model';
import { environment } from '../../environments/environment.development';

describe('SearchService', () => {
  let service: SearchService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SearchService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(SearchService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call the searchCity API with the correct URL and return expected data', () => {
    const dummyCities: CityData[] = [
      { lat: '51.5074', lon: '-0.1278', display_name: 'London, UK' },
      { lat: '40.7128', lon: '-74.0060', display_name: 'New York, USA' },
    ];

    service.searchCity('London').subscribe((cities: CityData[]) => {
      expect(cities).toEqual(dummyCities);
    });

    const expectedUrl = `${environment.searchUrl}?q=London&format=json`;
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(dummyCities);
  });

  it('should handle an empty result array', () => {
    const dummyCities: CityData[] = [];

    service.searchCity('UnknownCity').subscribe((cities: CityData[]) => {
      expect(cities.length).toBe(0);
    });

    const expectedUrl = `${environment.searchUrl}?q=UnknownCity&format=json`;
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(dummyCities);
  });
});
