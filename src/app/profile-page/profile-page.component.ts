import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service'; // Update the path as per your project structure
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css'],
  providers: [DatePipe],
})
export class ProfilePageComponent implements OnInit {
  isLoading = false;
  maxDate: string;
  userId = Number(localStorage.getItem('userId'));
  user = {
    Id: this.userId,
    userName: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    address: '',
    country: '',
    state: '',
    city: ''
  };

  constructor(private appService: AppService, private dateFormatPipe: DatePipe) {}

  ngOnInit(): void {
    const today = new Date();
    const tenYearsAgo = new Date(today.getFullYear() - 15, today.getMonth(), today.getDate());
    this.maxDate = tenYearsAgo.toISOString().split('T')[0];
    this.fetchUserDetails(this.userId);
  }

  fetchUserDetails(userId: number): void {
    this.isLoading = true;
    this.appService.GetUserById(userId).subscribe({
      next: (response) => {
        this.user = response;
        if (this.user.dateOfBirth) {
          this.user.dateOfBirth = this.dateFormatPipe.transform(
            this.user.dateOfBirth,
            'yyyy-MM-dd'
          );
        }
        
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onSubmit(profileForm: any): void {
    if (profileForm.valid) {
      if (confirm('Are you sure you want to update details?')) {
        this.isLoading = true;
        this.appService.UpdateUserDetails(this.user).subscribe({
          next: () => {
            this.isLoading = false;
            alert('User profile updated successfully.');
          },
          error: () => {
            this.isLoading = false;
          }
        });
      }
    } else {
      alert('Invalid form details. Please fill valid fields.');
    }
  }

  resetForm(profileForm: any): void {
    profileForm.resetForm();
  }
}