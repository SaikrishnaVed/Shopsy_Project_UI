import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import {MatSort, Sort, MatSortModule} from '@angular/material/sort';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
import { Subscription } from 'rxjs';
import { DataService } from '../data.service';
import {LiveAnnouncer} from '@angular/cdk/a11y';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
})
export class ProductsListComponent implements OnInit {
  private _liveAnnouncer: any;
  productList: any = [];
  isLoading = false;
  isReload = false;
  // dataSource = new MatTableDataSource<Product>(this.productList);
  dataSource = new MatTableDataSource(this.productList);
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

  constructor(
    private appService: AppService,
    private router: Router,
    private dataService: DataService,
    private liveAnnouncer: LiveAnnouncer // Inject LiveAnnouncer via constructor
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    // this.subscription = this.dataService.currentMessage.subscribe(
    //   (message: string) => {
    //     this.filter.SearchTerm = message;
    //     this.GetProductList();
    //   }
    // );
    this.GetProductList();
    this.isLoading = false;
    // if(this.isReload){
    //   window.location.reload();
    //   this.isReload = false;
    // }
  }

  // ngAfterViewInit() {
  //   this.sort.disableClear = true;
  //   // this.sort.sort({disableClear: true, id:sortEnabledColumns.id,start:'asc'})

  //   // this.dataSource.sort = this.sort;
  //   // this.dataSource.paginator = this.paginator;

  //   // Listen to pagination events
  //   this.paginator.page.subscribe(() => {
  //     this.filter.pageNumber = this.paginator.pageIndex + 1; // Page index starts at 0
  //     this.filter.pageSize = this.paginator.pageSize;
  //     this.GetProductList(); // Fetch data with updated pagination
  //   });

  //   // this.productList.paginator = this.paginator;
  //   // this.productList.sort = this.sort;
  // }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // // Navigate to the first page
  // onFirstPage(): void {
  //   if (this.filter.pageNumber > 1) {
  //     this.filter.pageNumber = 1;
  //     this.paginator.pageIndex = 0;
  //     this.GetProductList();
  //   }
  // }

  // // Navigate to the last page
  // onLastPage(totalPages: number): void {
  //   if (this.filter.pageNumber < totalPages) {
  //     this.filter.pageNumber = totalPages;
  //     this.paginator.pageIndex = totalPages - 1;
  //     this.GetProductList();
  //   }
  // }

  // // Navigate to the previous page
  // onPrevPage(): void {
  //   if (this.filter.pageNumber > 1) {
  //     this.filter.pageNumber--;
  //     this.paginator.pageIndex = this.filter.pageNumber - 1;
  //     this.GetProductList();
  //   }
  // }

  // // Navigate to the next page
  // onNextPage(totalPages: number): void {
  //   if (this.filter.pageNumber < totalPages) {
  //     this.filter.pageNumber++;
  //     this.paginator.pageIndex = this.filter.pageNumber - 1;
  //     this.GetProductList();
  //   }
  // }

  // /** Announce the change in sort state for assistive technology. */
  // announceSortChange(sortState: Sort) {
  //   // This example uses English messages. If your application supports
  //   // multiple language, you would internationalize these strings.
  //   // Furthermore, you can customize the message to add additional
  //   // details about the values being sorted.
    
  //    if (sortState.direction) {
  //       if (!sortState.active || !sortState.direction) {
  //         this.dataSource.data = this.productList; // Reset to original data
  //         return;
  //       }   

  //     this.dataSource.data = this.productList.sort((a, b) => {
  //       const isAsc = sortState.direction === 'asc';
  //       switch (sortState.active) {
  //         case 'product_name':
  //           return this.compare(a.product_name, b.product_name, isAsc);
  //         case 'list_price':
  //           return this.compare(a.list_price, b.list_price, isAsc);
  //         case 'quantity':
  //           return this.compare(a.quantity, b.quantity, isAsc);
  //         case 'model_year':
  //           return this.compare(a.model_year, b.model_year, isAsc);
  //         default:
  //           return 0;
  //       }
  //     });
  //     this.productList = this.dataSource.data;
  //   }
  // }

  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.

    // if (sortState.direction) {
    //   this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    // } else {
    //   this.liveAnnouncer.announce('Sorting cleared');
    // }

    // this.filter.SortBy = sortState.active;
    // this.filter.IsAscending = sortState.direction === 'asc';
    // this.GetProductList();

    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  // ngOnDestroy(): void {
  //   this.subscription.unsubscribe();
  // }

  GetProductList(): void {
    this.isLoading = true;
    this.appService.GetAllProducts(this.filter).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response?.items) {
          this.productList = response.items;
          // this.productList.paginator = this.paginator;
          // this.productList.sort = this.sort;
          this.dataSource.data = response.items;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
      error: () => {
        this.isLoading = false;
        this.router.navigate(['/login']);
        sessionStorage.clear();
      },
    });
  }
  
  onReset(form: any): void {
    form.reset();
  }

  onAddNewProduct(): void {
    sessionStorage.setItem('isEditMode', 'false');
    sessionStorage.removeItem('editProduct');
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
  
    sessionStorage.setItem('editProduct', JSON.stringify(updatedProduct));
    sessionStorage.setItem('isEditMode', 'true');
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

export interface Product {
  product_Name: string;
  list_Price: number;
  quantity: number;
  Model_Year: number;
  Color: string;
}

export interface Newproduct {
  product_Id: 0,
  product_Name: '',
  brand_Id: 0,
  category_Id: 0,
  model_Year: 0,
  list_Price: 0,
  quantity: 0,
  color: '',
  imagePath: ''
};