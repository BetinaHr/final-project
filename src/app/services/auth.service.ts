import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // Makes this service available app-wide
})
export class AuthService {
  private baseUrl = 'http://localhost:5000'; // Replace with your backend's URL if different

  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, data, { withCredentials: true });
  }
}
