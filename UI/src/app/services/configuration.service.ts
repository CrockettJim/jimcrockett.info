import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';

import { Configurations } from '../models/configurations';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService extends Configurations {

  private readonly http: HttpClient;
  constructor(private readonly httpBackend: HttpBackend) {
    super();
    this.http = new HttpClient(httpBackend);
  }

  public apiHeaders(): HttpHeaders {
    return new HttpHeaders({
        'Content-Type':  'application/json',
        'x-functions-key': this.api.key
      });
  }

  public load(): Promise<boolean> {
    return new Promise((resolve) => {
      this.http
        .get<ConfigurationService>('assets/config/config.json')
        .subscribe((results: Configurations) => {
          this.api = results.api;
          resolve(true);
        }, (error: any) => {
          console.error(error);
          resolve(false);
        });
    });
  }
}
