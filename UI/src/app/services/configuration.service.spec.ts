import { HttpHeaders } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, flush, TestBed } from '@angular/core/testing';
import { ApiConfigurations } from '../models/configurations';

import { ConfigurationService } from './configuration.service';

describe('ConfigurationService', () => {
  let service: ConfigurationService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(ConfigurationService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should return default api http headers', () => {
    service.api = { baseUrl: '', key: 'apiKey' };
    const expected = new HttpHeaders({ 'Content-Type': 'application/json', 'x-functions-key': service.api.key });

    const results = service.apiHeaders();

    expect(results).toBeInstanceOf(HttpHeaders);
    expect(results.keys).toEqual(expected.keys);
    expect(results.get('x-functions-key')).toEqual(expected.get('x-functions-key'));
  });

  it('should set the api configurations when retrieved', fakeAsync(() => {
    const expectedResults = new ApiConfigurations();
    let result;
    service.load().then(results => result = results);

    const request = httpTestingController.expectOne('assets/config/config.json');
    expect(request.request.method).toBe('GET');
    request.flush(expectedResults);

    flush();

    expect(result).toBeTrue();
  }));

  it('should log the error if no api configurations where retrieved', fakeAsync(() => {
    const spy = spyOn(console, 'error');
    let result;

    service.load().then(results => result = results);

    const request = httpTestingController.expectOne('assets/config/config.json');
    expect(request.request.method).toBe('GET');
    request.error(new ErrorEvent('Error'), { status: 500 , statusText: 'System exception.'});

    flush();

    expect(result).toBeFalse();
    expect(spy).toHaveBeenCalled();
  }));
});
