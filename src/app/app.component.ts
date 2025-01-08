import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DataService } from './data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'shopsy4';
  isLoginPage = false;
  isAdminPage = false;
  SearchTerm = '';
  subscription: Subscription;
  username: string;
  // , private cdr: ChangeDetectorRef
  constructor(private router: Router, private data: DataService) {
    this.isAdminPage = sessionStorage.getItem('role') == 'admin';
  }

  ngOnInit(): void {
    this.subscription = this.data.currentMessage.subscribe(message => this.SearchTerm = message)
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Check if the current route is the login page
        this.isLoginPage = (this.router.url === '/login') || (this.router.url === '/register');
        
        // Listen for role changes
        this.data.role.subscribe((role) => {
          this.isAdminPage = role === 'admin';
          this.username = sessionStorage.getItem('username');
        });
      }
    });

    this.data.role.subscribe((role) => {
      this.isAdminPage = role === 'admin';
      this.username = sessionStorage.getItem('username');
    });

    this.isAdminPage = sessionStorage.getItem('role') == 'admin';
    this.username = sessionStorage.getItem('username');
  }

  ngAfterViewInit() {
    // this.isAdminPage = sessionStorage.getItem('role') == 'admin' ? true : false;
    this.username = sessionStorage.getItem('username');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSearchTermChange(newSearchTerm: string): void {
    console.log('SearchTerm changed:', newSearchTerm);
    sessionStorage.setItem('SearchTerm', newSearchTerm);
    this.data.changeMessage(newSearchTerm);
  }

  GetProductsWishList(): void{
    // sessionStorage.setItem('isWishListFilter', 'true');
    this.router.navigate(['/allproducts']);
  }

  logout(): void {
    sessionStorage.clear();
    this.data.clearRole();
    this.router.navigate(['/login']);
  }
}