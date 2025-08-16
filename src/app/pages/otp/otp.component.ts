import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, timer } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OtpComponent implements OnDestroy {
  otp: string = '';
  userId: string | null = null;
  generalError: string = '';
  infoMessage: string = '';
  resendDisabled: boolean = false;
  timer: number = 60;
  private timerSubscription: Subscription | null = null;

  constructor(private auth: AuthService, private session: SessionService, private router: Router) {
    this.userId = this.session.get('pendingUserId');
    if (!this.userId) {
      // nothing pending: go back to register
      this.router.navigate(['/register']);
    } else {
      // show notification that OTP was sent when arriving from register
      this.infoMessage = 'OTP is sent to your registered Email ID, Please check Junk/Spam';
    }
  }

  submitOtp() {
    this.generalError = '';
    if (!this.otp || this.otp.trim() === '') {
      this.generalError = 'Please enter the OTP';
      return;
    }
    if (!this.userId) {
      this.generalError = 'Session expired. Please register again.';
      return;
    }
    const request = { userId: this.userId, otp: this.otp.trim() };
    this.auth.verifyOtp(request).subscribe({
      next: (res) => {
        // store verifyOtp response in session and then clear pending user and go home
        try {
          this.session.set('authResponse', JSON.stringify(res));
        } catch (e) {
          // ignore storage errors
          console.warn('Failed to store auth response in session', e);
        }
        this.session.remove('pendingUserId');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.generalError = err.error?.messages || 'OTP verification failed';
      }
    });
  }

  resendOtp() {
    this.generalError = '';
    if (!this.userId) {
      this.generalError = 'Session expired. Please register again.';
      return;
    }
    const request = { userId: this.userId };
    this.auth.resendOtp(request).subscribe({
      next: (res) => {
        // show explicit notification at top of screen
        this.infoMessage = 'OTP is sent to your registered Email ID, Please check Junk/Spam';
        this.startTimer();
      },
      error: (err) => {
        this.generalError = err.error?.message || 'Resend OTP failed';
      }
    });
  }

  startTimer() {
    this.resendDisabled = true;
    this.timer = 60;
    this.timerSubscription = timer(0, 1000).subscribe(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        this.resendDisabled = false;
        if (this.timerSubscription) {
          this.timerSubscription.unsubscribe();
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
