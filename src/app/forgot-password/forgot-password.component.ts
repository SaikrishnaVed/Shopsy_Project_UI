import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  email = '';
  isLoading = false;

  constructor(private appService: AppService, private router: Router) {}

  onSubmit(): void {
    if (this.email) {
      this.isLoading = true;
      const ForgotPasswordRequest = {
        Email: this.email
      }
      this.appService.forgotPassword(ForgotPasswordRequest).subscribe({
        next: () => {
          this.isLoading = false;
          alert('Password reset email has been sent.');
        },
        error: (err) => {
          this.isLoading = false;
          alert('Failed to send password reset email. Please try again.');
          console.error(err);
        },
        complete: () => { 
          this.isLoading = false;
        },
      });
    } else {
      alert('Please enter a valid email address.');
    }
  }
}