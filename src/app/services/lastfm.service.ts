import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LastfmService {
  private apiUrl = 'https://ws.audioscrobbler.com/2.0/';  // LastFM API endpoint
  private apiKey = 'dec11ca20d22eff7c376b16ffe27556c'; 

  constructor(private http: HttpClient) {}

  // Fetch artists by genres
  getArtistsByGenres(genres: string[]): Observable<any> {
    const genreQueries = genres.map(genre => 
      `&genre=${encodeURIComponent(genre)}`
    ).join('');
    
    const url = `${this.apiUrl}?method=tag.gettopartists&api_key=${this.apiKey}&format=json${genreQueries}`;

    return this.http.get<any>(url);
  }

  searchByArtist(artist: string): Observable<any> {
    const url = `https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${artist}&api_key=YOUR_API_KEY&format=json`;
    return this.http.get<any>(url);
  }

  searchByAlbum(album: string, artist: string): Observable<any> {
    const url = `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&album=${album}&artist=${artist}&api_key=YOUR_API_KEY&format=json`;
    return this.http.get<any>(url);
  }
}
