import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from '../app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, AfterViewInit {
  usersList: any[] = [];
  isLoading = false;
  dataSource = new MatTableDataSource<any>([]);
  currentRole = sessionStorage.getItem('role');
  displayedColumns: string[] = [
    'userName',
    'email',
    'role',
    'isActive',
    'phone',
    'gender',
    'dateOfBirth',
    'actions',
  ];

  roles = [
    { value: 'user', viewValue: 'User' },
    { value: 'admin', viewValue: 'Admin' },
  ];

  editingRow: any = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private appService: AppService, private router: Router) {}

  ngOnInit(): void {
    this.GetUserList();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  GetUserList(): void {
    this.isLoading = true;
    this.appService.GetAllAuthUsers().subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response) {
          this.usersList = response;
          this.dataSource.data = response;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
      error: () => {
        this.isLoading = false;
        this.router.navigate(['/error-page']);
      },
    });
  }

  startEditing(row: any): void {
    this.editingRow = { ...row };
  }

  updateRoleAndStatus(): void {
    if (this.editingRow) {
      const updatedUser = {
        userId: this.editingRow.id,
        role: this.editingRow.role,
        isActive: this.editingRow.isActive,
      };

      this.isLoading = true;
      if (confirm('Are you sure you want to update user status?')) {
        this.appService.UpdateUserRole(updatedUser).subscribe({
          next: () => {
            this.isLoading = false;
            if (updatedUser.userId === Number(sessionStorage.getItem('userId'))) {
              this.currentRole = updatedUser.role;
              sessionStorage.setItem('role', this.currentRole);
            }

            alert('User updated successfully!');
            const index = this.usersList.findIndex((u) => u.id === this.editingRow.id);
            if (index !== -1) {
              this.usersList[index] = { ...this.editingRow };
              this.dataSource.data = [...this.usersList];
            }
            this.editingRow = null;
          },
          error: (err) => {
            this.isLoading = false;
            console.error('Error updating user', err);
            alert('Failed to update user. Please try again.');
          },
        });
      }
    }
  }

  cancelEditing(): void {
    this.editingRow = null;
  }
}