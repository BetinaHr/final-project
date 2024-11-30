import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LastfmService } from '../services/lastfm.service';  // Import the service

// Define the type for the possible moods
type Mood = 'Happy' | 'Hopeful' | 'Empowered' | 'Excited' | 'Optimistic' | 'Relaxed' | 'Confident' | 'Peaceful' |
  'Sad' | 'Depressed' | 'Jealous' | 'Overwhelmed' | 'Stressed' | 'Tired' | 'Bored' | 'Hopeless';

@Component({
  selector: 'app-home-component',
  standalone: true,
  imports: [],
  templateUrl: './home-component.component.html',
  styleUrls: ['./home-component.component.css']
})
export class HomeComponentComponent {
  moodGenreMap: Record<Mood, string[]> = {
    'Happy': ['Pop', 'Dance', 'Reggae'],
    'Hopeful': ['Pop', 'Indie', 'Rock'],
    'Empowered': ['Rock', 'Alternative', 'Hip-Hop'],
    'Excited': ['EDM', 'Dance', 'Pop'],
    'Optimistic': ['Pop', 'Indie', 'Folk'],
    'Relaxed': ['Classical', 'Lo-Fi', 'Jazz'],
    'Confident': ['Pop', 'Rock', 'Hip-Hop'],
    'Peaceful': ['Jazz', 'Classical', 'Ambient'],
    'Sad': ['Blues', 'Acoustic', 'Jazz'],
    'Depressed': ['Blues', 'Acoustic', 'Classical'],
    'Jealous': ['Rock', 'Metal'],
    'Overwhelmed': ['Indie', 'Alternative'],
    'Stressed': ['Rock', 'Alternative', 'EDM'],
    'Tired': ['Classical', 'Ambient', 'Lo-Fi'],
    'Bored': ['Pop', 'Indie', 'Folk'],
    'Hopeless': ['Blues', 'Jazz']
  };

  selectedMoods: string[] = [];

  constructor(private router: Router, private lastfmService: LastfmService) {}

  onMoodSelectionChange(mood: string, event: any) {
    const selectedMood = mood as Mood; // Assert as Mood type
    if (event.target.checked) {
      this.selectedMoods.push(selectedMood);  // Add selected mood to the list
    } else {
      const index = this.selectedMoods.indexOf(selectedMood);
      if (index > -1) {
        this.selectedMoods.splice(index, 1);  // Remove mood if unchecked
      }
    }
  }

  getGenresForMoods(): string[] {
    const genres = new Set<string>();
    this.selectedMoods.forEach(mood => {
      const genresForMood = this.moodGenreMap[mood as Mood] || [];
      genresForMood.forEach(genre => genres.add(genre));
    });
    return Array.from(genres);
  }

  generatePlaylist() {
    const genres = this.getGenresForMoods();
    if (genres.length > 0) {
      this.lastfmService.getArtistsByGenres(genres).subscribe(
        (data) => {
          console.log('Generated Playlist:', data);
          console.log('Navigating with genres:', genres.join(','));
          this.router.navigate(['/playlist'], { queryParams: { genres: genres.join(',') } });
        },
        (error) => {
          console.error('Error generating playlist:', error);
        }
      );
    }
  }
}
