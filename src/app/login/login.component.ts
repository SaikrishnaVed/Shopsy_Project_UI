import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginData = { UserName: '', Password: '' };
  isLoading = false;
  constructor(private http: HttpClient, private router: Router, private appService: AppService) {}

  ngOnInit(): void {
    this.isLoading = true;
    if(localStorage.getItem('token') != undefined){
      if(localStorage.getItem('role') == "admin")
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
            console.log(response?.token);
            console.log(response?.role);
            console.log(response?.userId);
            localStorage.setItem('token', response.token);
            const payload = JSON.parse(atob(response.token.split('.')[1]));
            localStorage.setItem('role', payload.role);
            localStorage.setItem('userId', response?.userId);
            localStorage.setItem('username', response?.username);
            // localStorage.setItem('role', response.role);
            if(payload.role === 'admin'){
              // this.router.navigate(['/products']);
              this.router.navigate(['/productslist']);
            }
            else if(payload.role === 'user')
              this.router.navigate(['/allproducts']);
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          // console.error('Error fetching product list:', err);
          alert('Invalid username or password');
          this.router.navigate(['/login']);
          localStorage.clear();
        },
      });
    }
  }
}