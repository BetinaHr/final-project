import { Component, OnInit } from '@angular/core';
import { LastfmService } from '../services/lastfm.service'; 
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-playlists',
  standalone: true,
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.css'],
  imports: [CommonModule]
})
export class PlaylistsComponent implements OnInit {
  artistData: any[] = []; 
  albumData: any[] = []; 
  trackData: any[] = []; 
  genre: string = ''; 

  constructor(private lastfmService: LastfmService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const genresParam = params['genres'];
      if (genresParam) {
        this.genre = genresParam.split(',');  
        console.log('Genres received in playlist:', this.genre);
        this.fetchPlaylistData();
      }
    });
  }

  fetchPlaylistData() {
    if (this.genre) {
      const genres = this.genre.split(',');
      this.lastfmService.getArtistsByGenres(genres).subscribe(
        (data) => {
          console.log('Fetched playlist data:', data);
          this.artistData = data.topartists.artist;
        },
        (error) => {
          console.error('Error fetching playlist data:', error);
        }
      );
    }
  }

  // Method to fetch albums based on the selected artist
  fetchAlbumData(artist: string) {
    this.lastfmService.searchByArtist(artist).subscribe(
      (data) => {
        console.log('Fetched album data:', data);
        this.albumData = data.topalbums.album; 
      },
      (error) => {
        console.error('Error fetching album data:', error);
      }
    );
  }

  // Method to fetch tracks based on the selected album and artist
  fetchTrackData(album: string, artist: string) {
    this.lastfmService.searchByAlbum(album, artist).subscribe(
      (data) => {
        console.log('Fetched track data:', data);
        this.trackData = data.album.tracks.track;
      },
      (error) => {
        console.error('Error fetching track data:', error);
      }
    );
  }
}
