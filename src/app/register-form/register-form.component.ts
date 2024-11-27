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
      username: [''],
      email: [''],
      password: [''],
      confirmPassword: [''],
      acceptTerms: [false]
    });
  }

  // Handle form submission
  // onSubmit() {
  //   const formData = this.registerForm.value;
  //   console.log('----');
  //   console.log(formData);
    

  //   // Call the register API
  //   this.authService.register({
  //     username: this.registerForm.value.username,
  //     email: this.registerForm.value.email,
  //     password: this.registerForm.value.password
  //   }).subscribe(
  //     (response) => {
  //       console.log('Registration successful:', response);
  //     },
  //     (error) => {
  //       console.error('Registration error:', error);
  //     });
  // }

  onSubmit() {
    // Extract values from form
    const { username, email, password, confirmPassword, acceptTerms } = this.registerForm.value;
    console.log('username is', username, 'email is:', email);
    
    // You can add a check to ensure confirmPassword matches password
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
  
    // Call the registration API
    this.authService.register({ username, email, password, acceptTerms })
      .subscribe(
        (response) => {
          console.log('Registration successful:', response);
        },
        (error) => {
          console.error('Registration error:', error);
        }
      );
  }

//   onSubmit() {
//     if (this.registerForm.valid) {
//       const formData = this.registerForm.value;
//       this.authService.register(formData).subscribe({
//         next: (response) => console.log('Registration successful:', response),
//         error: (err) => console.error('Registration error:', err),
//       });
//     }
//   }
}
