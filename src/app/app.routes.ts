import { Routes } from '@angular/router';
import { HomeComponentComponent } from './home-component/home-component.component';
import { RegisterFormComponent } from './register-form/register-form.component';
import { LoginFormComponent } from './login-form/login-form.component';

export const routes: Routes = [
    {path: 'home', component: HomeComponentComponent},
    {path: 'register', component: RegisterFormComponent},
    {path: 'login', component: LoginFormComponent},
];
