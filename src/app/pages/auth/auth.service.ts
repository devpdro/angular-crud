import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface User {
  name: string;
  email: string;
  password: string | number;
  password_confirmation: string | number;
  token?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `/api`;

  constructor(private http: HttpClient) {}

  getCsrfCookie(): Observable<any> {
    return this.http.get(`/sanctum/csrf-cookie`, { withCredentials: true });
  }

  register(userData: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData, {
      withCredentials: true,
      headers: new HttpHeaders({
        Accept: 'application/json',
      }),
    });
  }

  login(loginData: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, loginData, {
      withCredentials: true,
      headers: new HttpHeaders({
        Accept: 'application/json',
      }),
    });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true });
  }

  getUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user`, { withCredentials: true });
  }
}
