import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  isLinear = false;
  dateOfBirth: '';
  registerData = {
    UserName: '',
    Email: '',
    PasswordHash: '',
    DateOfBirth: '',
    Role: 'user',
    isActive: true
  };

  constructor(private router: Router, private appService: AppService) {}

  onRegisterSubmit(form: any): void {
    if (form.valid) {
      this.registerData.UserName = this.username;
      this.registerData.Email = this.email;
      this.registerData.PasswordHash = this.password;
      this.registerData.DateOfBirth = this.dateOfBirth;

      this.appService.RegisterUser(this.registerData).subscribe({
        next: (response: any) => {
          if (response) {
            alert('Registration successful!');
            this.router.navigate(['/login']);
          }
        },
        error: (err) => {
          alert('Registration failed, please try again.');
          console.error('Error during registration:', err);
        },
      });
    } else {
      alert('Please fill out the form correctly.');
    }
  }
}
