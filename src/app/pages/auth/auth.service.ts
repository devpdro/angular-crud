import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface User {
  name: string;
  email: string;
  password: string | number;
  password_confirmation: string | number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `/api`;

  constructor(private http: HttpClient) {}

  register(userData: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData, {
      headers: new HttpHeaders({
        Accept: 'application/json',
      }),
    });
  }

  login(loginData: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, loginData, {
      headers: new HttpHeaders({
        Accept: 'application/json',
      }),
    });
  }

  logout(): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/logout`,
      {},
      {
        headers: new HttpHeaders({
          Accept: 'application/json',
        }),
      }
    );
  }

  getUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user`, {
      headers: new HttpHeaders({
        Accept: 'application/json',
      }),
    });
  }
}
