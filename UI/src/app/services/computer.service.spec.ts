import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, flush, flushMicrotasks, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';

import { ComputerService } from './computer.service';
import { ConfigurationService } from './configuration.service';

describe('ComputerService', () => {
  let service: ComputerService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: ConfigurationService, useValue: { apiHeaders: () => '', api: { baseUrl: '' } } }
      ]
    });
    service = TestBed.inject(ComputerService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should publish message strings', () => {
    expect(service.message()).toBeInstanceOf(Observable);
  });

  it('should give a welcome message on start', fakeAsync(() => {
    const expected = (service as any).defaultWelcomeMessage;
    let result = '';

    service.message().subscribe(message => {
      result = message;
    });
    flush();

    expect(result).toEqual(expected);
  }));

  it('should initiate a conversation with the api', () => {
    const expectedUrl = TestBed.inject(ConfigurationService).api.baseUrl + '/StartConversation';

    const request = httpTestingController.expectOne(expectedUrl);
    expect(request.request.method).toBe('POST');
  });
  it('should send a message to the api', () => {
    const expectedUrl = TestBed.inject(ConfigurationService).api.baseUrl + '/SendMessage';
    const expectedMessage = 'test';

    service.send(expectedMessage);

    const request = httpTestingController.expectOne(expectedUrl);
    expect(request.request.method).toBe('POST');
    expect(request.request.body.userInput).toBe(expectedMessage);
  });
  it('should return the results of the message', () => {
    const expected = [ 'test results' ];
    const expectedResponse = { id: 1, messages: expected };
    const expectedUrl = TestBed.inject(ConfigurationService).api.baseUrl + '/SendMessage';
    const results = [];

    service.send('test');
    service.message().subscribe(result => {
      results.push(result);
    });

    const request = httpTestingController.expectOne(expectedUrl);
    request.flush(expectedResponse);
  });
  it('should return a default response on error', fakeAsync(() => {
    const expectedUrl = TestBed.inject(ConfigurationService).api.baseUrl + '/SendMessage';
    const expected = (service as any).defaultResponse;
    const results = [];

    service.send('error');
    service.message().subscribe(result => {
      results.push(result);
    });

    const request = httpTestingController.expectOne(expectedUrl);
    request.error(new ErrorEvent('Error'), { status: 500 , statusText: 'System exception.'});
    expect(request.request.method).toBe('POST');

    flush();

    expect(results.slice(1, results.length)).toEqual(expected);
  }));
});
