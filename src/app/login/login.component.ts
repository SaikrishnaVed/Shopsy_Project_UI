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
            this.data.updateRole(response?.role);
            console.log(response?.token);
            console.log(response?.role);
            console.log(response?.userId);
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
}