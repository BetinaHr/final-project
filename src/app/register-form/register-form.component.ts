import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule], // Only modules go here
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent {
  registerForm: FormGroup;
  errors: string[] = [];

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { // Inject Router here
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    });
  }

  onSubmit() {
    const { username, email, password, confirmPassword, acceptTerms } = this.registerForm.value;

    // Password confirmation validation
    if (password !== confirmPassword) {
      this.errors = ['Passwords do not match'];
      return;
    }

    this.authService.register({ username, email, password, acceptTerms }).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.errors = [];
        this.router.navigate(['/']); // Redirect to home page
      },
      error: (err) => {
        if (err.error && err.error.error) {
          this.errors = [err.error.error]; // Show backend error message
        } else {
          this.errors = ['An unexpected error occurred.'];
        }
      }
    });
  }
}
