import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email: string = '';
  password: string = '';

  // inline error messages
  emailError: string = '';
  passwordError: string = '';
  generalError: string = '';

  constructor(private authService: AuthService, private session: SessionService, private router: Router) { }

  ngOnInit(): void {
    // if user already has an auth response in session, redirect to home
    const auth = this.session.get('authResponse');
    if (auth) {
      // you can parse and validate if needed: const parsed = JSON.parse(auth);
      this.router.navigate(['/home']);
      return;
    }
  }

  login() {
    // clear previous errors
    this.emailError = '';
    this.passwordError = '';
    this.generalError = '';

    const deviceId = this.getDeviceID();
    const deviceType = this.getDeviceName();

    // client-side presence validations
    if (!this.email || this.email.trim() === '') {
      this.emailError = 'Please enter your email address';
      return;
    }
    if (!this.password || this.password.trim() === '') {
      this.passwordError = 'Please enter your password';
      return;
    }

    this.authService.login(this.email, this.password, deviceId, deviceType)
      .subscribe({
        next: (response) => {
          // store entire response in session and navigate to home
          try {
            this.session.set('authResponse', JSON.stringify(response));
          } catch (e) {
            console.warn('Failed to store auth response', e);
          }
          this.generalError = '';
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Login error', error);
          this.generalError = error.error?.messages || 'Login failed. Please try again.';
        }
      });
  }

  getDeviceID(): string {
    return 'web';
  }

  getDeviceName(): string {
    return 'Web Browser';
  }
}
