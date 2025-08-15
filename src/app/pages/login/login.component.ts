import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

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

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  login() {
    const deviceId = this.getDeviceID();
    const deviceType = this.getDeviceName();

    this.authService.login(this.email, this.password, deviceId, deviceType)
      .subscribe({
        next: (response) => {
          console.log('Login success', response);
        },
        error: (error) => {
          console.error('Login error', error);
        }
      });
  }

  // Mocked Helper methods kept inside the class to avoid TS errors
  getDeviceID(): string {
    // Replace with actual Helper.sharedInstance.getDeviceID() logic
    return 'web';
  }

  getDeviceName(): string {
    // Replace with actual Helper.sharedInstance.getDeviceName() logic
    return 'web';
  }
}