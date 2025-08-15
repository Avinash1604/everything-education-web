import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl + '/api/v1/users';
  private registerUrl = environment.apiUrl + '/api/v1/users/register';
  private basicAuth = btoa('admin:everthing@123');

  constructor(private http: HttpClient) {}

  login(email: string, password: string, deviceId: string, deviceType: string): Observable<any> {
    const request = { email, password, deviceId, deviceType };
    const headers = new HttpHeaders({
      'Authorization': `Basic ${this.basicAuth}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(this.apiUrl, request, { headers });
  }

  register(payload: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    dob?: string;
    token?: string;
    parentConsent?: boolean;
  }): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Basic ${this.basicAuth}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(this.registerUrl, payload, { headers });
  }
}
