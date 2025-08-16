import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { OtpComponent } from './pages/otp/otp.component';
import { HomeComponent } from './pages/home/home.component';
import { AnnouncementsComponent } from './pages/notifications/announcements.component';
import { AuthGuard } from './services/auth.guard';
import { RedirectIfAuthGuard } from './services/redirect-if-auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [RedirectIfAuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [RedirectIfAuthGuard] },
  { path: 'otp', component: OtpComponent, canActivate: [RedirectIfAuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'announcements', component: AnnouncementsComponent, canActivate: [AuthGuard] }
];
