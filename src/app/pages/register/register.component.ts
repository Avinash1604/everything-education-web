import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

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

  constructor(private authService: AuthService) {}

  register() {
    if (this.password !== this.confirmPassword) {
      console.warn('Passwords do not match');
      return;
    }

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
        console.log('Register success', res);
        // navigate or show success message as needed
      },
      error: (err) => {
        console.error('Register error', err);
        // show error to user as needed
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
