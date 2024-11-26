import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule], // Only modules go here
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent {
  registerForm: FormGroup;

  // Inject AuthService in the constructor
  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      name: [''],
      email: [''],
      password: [''],
      confirmPassword: [''],
      acceptTerms: [false]
    });
  }

  // Handle form submission
  onSubmit() {
    const formData = this.registerForm.value;
    console.log(formData);
    

    // Call the register API
    this.authService.register(formData).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
      },
      error: (err) => {
        console.error('Registration error:', err);
      }
    });
  }
}
