import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginData = { UserName: '', Password: '' };
  isLoading = false;
  email = '';
  isForgotPwd = false;
  isResetPassword = false;
  newPassword = '';
  confirmPassword = '';
  token: string | null = null;

  constructor(private http: HttpClient, private router: Router, private appService: AppService, private data: DataService) {}

  ngOnInit(): void {
    this.isLoading = true;
    if(sessionStorage.getItem('token') != undefined){
      if(sessionStorage.getItem('role') == "admin")
        this.router.navigate(['/products']);
      else
      this.router.navigate(['/allproducts']);
    }
    else{
      this.router.navigate(['/login']);
    }
    this.isLoading = false;
  }

  onLoginSubmit(form: any): void {
    if (form.valid) {
      this.isLoading = true;
      this.appService.LoginUser(this.loginData).subscribe({
        next: (response: any) => {
          if(response){
            // const computerName = response.headers.get('X-Computer-Name');
            // console.log('Computer Name from Header:', computerName);
            this.data.updateRole(response?.role);
            sessionStorage.setItem('token', response.token);
            const payload = JSON.parse(atob(response.token.split('.')[1]));
            sessionStorage.setItem('role', payload.role);
            sessionStorage.setItem('userId', response?.userId);
            sessionStorage.setItem('username', response?.username);
            if(payload.role === 'admin'){
              this.router.navigate(['/productslist']);
            }
            else if(payload.role === 'user')
              this.router.navigate(['/allproducts']);
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          alert('Invalid username or password');
          this.router.navigate(['/login']);
          sessionStorage.clear();
        },
      });
    }
  }

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
          this.router.navigate(['/login']);
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

  getOS(): void {
    let userAgent = window.navigator.userAgent.toLowerCase(),
      macosPlatforms = /(macintosh|macintel|macppc|mac68k|macos)/i,
      windowsPlatforms = /(win32|win64|windows|wince)/i,
      iosPlatforms = /(iphone|ipad|ipod)/i,
      os = null;``
  
    if (macosPlatforms.test(userAgent)) {
      os = "macos";
    } else if (iosPlatforms.test(userAgent)) {
      os = "ios";
    } else if (windowsPlatforms.test(userAgent)) {
      os = "windows";
    } else if (/android/.test(userAgent)) {
      os = "android";
    } else if (!os && /linux/.test(userAgent)) {
      os = "linux";
    }
  
    return os;
  }

  navigateToForgotPassword(): void {
    this.isForgotPwd = true;
    // this.router.navigate(['/forgot-password']);
  }
}