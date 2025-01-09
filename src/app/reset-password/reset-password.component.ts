import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../app.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  newPassword = '';
  confirmPassword = '';
  token: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private appService: AppService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      alert('Invalid reset password link');
      this.router.navigate(['/login']);
    }
  }

  onResetPassword(form: any): void {
    if (form.valid && this.token) {
      const ResetPassword = {
        token: this.token,
        newPassword: this.newPassword, 
      }
      this.appService.ResetPassword(ResetPassword)
      .subscribe({
        next: () => {
          alert('Password reset successful! Please log in with your new password.');
          this.router.navigate(['/login']);
        },
        error: () => {
          alert('Failed to reset password. Please try again.');
        },
      });
    }
  }
}