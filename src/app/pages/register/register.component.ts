import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  firstName: string = '';
  lastName: string = '';
  dob: string = ''; // YYYY-MM-DD from <input type="date">
  token: string = ''; // set if available

  consent: boolean = false; // bound to checkbox in template

  // inline error messages
  firstNameError: string = '';
  lastNameError: string = '';
  emailError: string = '';
  passwordError: string = '';
  confirmPasswordError: string = '';
  dobError: string = '';
  consentError: string = '';
  generalError: string = '';

  constructor(private authService: AuthService, private router: Router, private session: SessionService) {}

  private showAlert(title: string, message: string) {
    window.alert(`${title}\n\n${message}`);
  }

  private isValidName(name: string): boolean {
    if (!name) return false;
    return /^[A-Za-z\s]{2,}$/.test(name.trim());
  }

  private isValidEmail(email: string): boolean {
    if (!email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  private isValidPassword(pwd: string): boolean {
    if (!pwd) return false;
    return /^(?=.{8,})(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/.test(pwd);
  }

  private clearErrors() {
    this.firstNameError = '';
    this.lastNameError = '';
    this.emailError = '';
    this.passwordError = '';
    this.confirmPasswordError = '';
    this.dobError = '';
    this.consentError = '';
    this.generalError = '';
  }

  register() {
    this.clearErrors();

    // firstName checks
    if (this.firstName.trim() === '') {
      this.firstNameError = 'Please enter first name';
      return;
    } else if (!this.isValidName(this.firstName)) {
      this.firstNameError = 'Please enter valid name';
      return;
    }

    // lastName checks
    if (this.lastName.trim() === '') {
      this.lastNameError = 'Please enter last name';
      return;
    } else if (!this.isValidName(this.lastName)) {
      this.lastNameError = 'Please enter valid name';
      return;
    }

    // email checks
    if (this.email.trim() === '') {
      this.emailError = 'Please enter email';
      return;
    } else if (!this.isValidEmail(this.email)) {
      this.emailError = 'Please enter a valid email';
      return;
    }

    // password checks
    if (this.password.trim() === '') {
      this.passwordError = 'Please enter a password';
      return;
    } else if (!this.isValidPassword(this.password)) {
      this.passwordError = 'Password must be 8+ chars, include a digit and a special character.';
      return;
    }

    // confirm password
    if (this.confirmPassword.trim() === '') {
      this.confirmPasswordError = 'Please confirm a password';
      return;
    } else if (this.confirmPassword !== this.password) {
      this.confirmPasswordError = 'Password and confirm password are not matching';
      return;
    }

    // dob check
    if (this.dob.trim() === '') {
      this.dobError = 'Please enter dob';
      return;
    }

    // age below 13 and consent
    if (this.ageBelow13Years() && this.consent === false) {
      this.consentError = 'Please select the consent';
      return;
    }

    // build payload and call API
    const payload = {
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      password: this.password,
      dob: this.dob,
      token: this.token,
      parentConsent: this.ageBelow13Years()
    };

    this.authService.register(payload).subscribe({
      next: (res) => {
        // expect userId inside res.responseDetails.userId or res.userId
        const userId = res?.responseDetails?.userId ?? res?.userId;
        if (userId) {
          this.session.set('pendingUserId', userId);
          this.router.navigate(['/otp']);
          return;
        }
        console.log('Register success (no userId)', res);
      },
      error: (err) => {
        console.error('Register error', err);
        this.generalError = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }

  // returns true if user is below 13 years (parentConsent required)
  ageBelow13Years(): boolean {
    if (!this.dob) return false;
    const dobDate = new Date(this.dob);
    if (isNaN(dobDate.getTime())) return false;
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const m = today.getMonth() - dobDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }
    return age < 13;
  }
}
