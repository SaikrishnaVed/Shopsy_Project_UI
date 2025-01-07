import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DataService } from './data.service';
import { Subscription } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'shopsy4';
  isLoginPage = false;
  isAdminPage = false;
  SearchTerm = '';
  subscription: Subscription;
  username: string;

  constructor(private router: Router, private data: DataService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.subscription = this.data.currentMessage.subscribe(message => this.SearchTerm = message)
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Check if the current route is the login page
        this.isLoginPage = (this.router.url === '/login') || (this.router.url === '/register');
        this.cdr.detectChanges();
      }
    });
    this.isAdminPage = localStorage.getItem('role') == 'admin';
    this.username = localStorage.getItem('username');
  }

  ngAfterViewInit() {
    // this.isAdminPage = localStorage.getItem('role') == 'admin' ? true : false;
    this.username = localStorage.getItem('username');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSearchTermChange(newSearchTerm: string): void {
    console.log('SearchTerm changed:', newSearchTerm);
    localStorage.setItem('SearchTerm', newSearchTerm);
    this.data.changeMessage(newSearchTerm);
  }

  GetProductsWishList(): void{
    // sessionStorage.setItem('isWishListFilter', 'true');
    this.router.navigate(['/allproducts']);
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}