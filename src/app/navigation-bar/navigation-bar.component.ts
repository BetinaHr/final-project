import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.css'
})
export class NavigationBarComponent {
  constructor(private authService: AuthService, private router: Router) {}
 
  isAuthenticated: boolean = false;

  checkAuthenticationStatus() {
    const token = localStorage.getItem('AUTH');
    this.isAuthenticated = !!token;
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logout successful!');
        localStorage.removeItem('AUTH');
        this.isAuthenticated = !this.isAuthenticated;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout failed:', err);
      },
    });
  }
}
