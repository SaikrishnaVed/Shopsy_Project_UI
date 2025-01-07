import { Component, OnDestroy, OnInit } from '@angular/core';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { Product } from '../products-cards/products-cards.component';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Newproduct } from '../products-list/products-list.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-products-list-new',
  templateUrl: './products-list-new.component.html',
  styleUrls: ['./products-list-new.component.css']
})
export class ProductsListNewComponent implements AfterViewInit, OnDestroy {
  // ngOnInit(): void {
  //   throw new Error('Method not implemented.');
  // }
  // displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  productList: any = [];
  isLoading = false;
  isReload = false;
  dataSource = new MatTableDataSource<Product>(this.productList);
  displayedColumns: string[] = [
    'product_Name',
    'list_Price',
    'quantity',
    'color',
    'model_Year',
    'actions'
  ];
  filter = {
    pageNumber: 1,
    pageSize: 5,
    SearchTerm: '',
    SortBy: '',
    IsAscending: false,
    Skip: 0,
  };

  private subscription: Subscription;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  private _liveAnnouncer: any;

  constructor(
      private appService: AppService,
      private router: Router,
      // private liveAnnouncer: LiveAnnouncer,
      private dataService: DataService
    ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.subscription = this.dataService.currentMessage.subscribe(
      (message: string) => {
        this.filter.SearchTerm = message;
        this.GetProductList();
      }
    );
    
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  GetProductList(): void {
    this.isLoading = true;
    this.appService.GetAllProducts(this.filter).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response?.items) {
          this.productList = response.items;
          this.dataSource.data = response.items;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
      error: () => {
        this.isLoading = false;
        this.router.navigate(['/login']);
        localStorage.clear();
      },
    });
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

    onReset(form: any): void {
      form.reset();
    }

    reloadCurrentRoute() {
      let currentUrl = this.router.url;
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate([currentUrl]);
      });
    }
  
    onAddNewProduct(): void {
      localStorage.setItem('isEditMode', 'false');
      localStorage.removeItem('editProduct');
      this.router.navigate(['/addProduct']);
    }
  
    onEdit(row: any): void {
      const updatedProduct: Newproduct = {
        product_Id: row.product_Id,
        product_Name: row.product_Name,
        brand_Id: row.brand_Id || 0,
        category_Id: row.category_Id || 0,
        model_Year: row.model_Year,
        list_Price: row.list_Price,
        quantity: row.quantity,
        color: row.color,
        imagePath: row.imagePath || '',
      };
    
      localStorage.setItem('editProduct', JSON.stringify(updatedProduct));
      localStorage.setItem('isEditMode', 'true');
      // Navigate to the Add Product component
      this.router.navigate(['/addProduct']);
    }
  
    onDelete(row: any): void {
      if (confirm(`Are you sure you want to delete ${row.product_Name}?`)) {
        this.appService.DeleteProductItem(row.product_Id).subscribe({
          next: (response: any) => {
            this.GetProductList();
            this.router.navigate(['/products']);
          },
          error: () => {
            alert('error occured while deleteing.');
          },
        });
  
        alert(`Product ${row.product_Name} deleted successfully.`);
      }
    }

}