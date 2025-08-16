import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl + '/api/v1/users';
  private registerUrl = environment.apiUrl + '/api/v1/users';
  private otpUrl = environment.apiUrl + '/api/v1/users/otp';
  private resendOtpUrl = environment.apiUrl + '/api/v1/users/otp/resend';
  private basicAuth = btoa('admin:everthing@123');

  constructor(private http: HttpClient) {}

  login(email: string, password: string, deviceId: string, deviceType: string): Observable<any> {
    const params = new HttpParams()
      .set('email', email)
      .set('password', password)
      .set('deviceId', deviceId)
      .set('token', "")
      .set('deviceType', deviceType);

    const headers = new HttpHeaders({
      'Authorization': `Basic ${this.basicAuth}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(this.apiUrl, { headers, params });
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

  // verify OTP
  verifyOtp(payload: { userId: string; otp: string }): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Basic ${this.basicAuth}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<any>(this.otpUrl, { headers, params: payload });
  }

  // resend OTP
  resendOtp(payload: { userId: string }): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Basic ${this.basicAuth}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<any>(this.resendOtpUrl, { headers, params: payload });
  }
}
