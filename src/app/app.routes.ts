import { Routes } from '@angular/router';
import { HomeComponentComponent } from './home-component/home-component.component';
import { RegisterFormComponent } from './register-form/register-form.component';
import { LoginFormComponent } from './login-form/login-form.component';
// import { AuthGuard } from './services/auth.guard'; // Import your auth guard

export const routes: Routes = [
  { path: 'home', component: HomeComponentComponent},  // Protecting 'home' route
  { path: 'register', component: RegisterFormComponent },
  { path: 'login', component: LoginFormComponent },
  { path: '**', redirectTo: 'home' } // Wildcard route
];
