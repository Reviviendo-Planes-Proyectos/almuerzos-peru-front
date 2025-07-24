import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = environment.apiUrl;

  getHealth(): Observable<any> {
    return this.http.get(`${this.baseUrl}/health`);
  }

  constructor(private readonly http: HttpClient) {}
}
