import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // Base URL for the API (replace with actual API URL)
  private baseUrl = 'https://api.example.com/music'; // Update this with the actual API URL

  constructor(private http: HttpClient) {}

  // Method to get music data (you can change this based on API endpoints)
  getMusicData(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/some-endpoint`); // Replace with the actual endpoint
  }
}
