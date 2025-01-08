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
    this.GetProductList();
    this.isLoading = false;
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