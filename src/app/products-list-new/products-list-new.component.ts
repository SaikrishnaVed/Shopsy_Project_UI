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
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import * as docxtemplater from 'docxtemplater';
import { MatDialog } from '@angular/material/dialog';
import autoTable from 'jspdf-autotable';
import { ProductPreviewDialogComponent } from '../product-preview-dialog/product-preview-dialog.component';

@Component({
  selector: 'app-products-list-new',
  templateUrl: './products-list-new.component.html',
  styleUrls: ['./products-list-new.component.css']
})
export class ProductsListNewComponent implements AfterViewInit, OnDestroy {
  productList: any = [];
  isLoading = false;
  isReload = false;
  selectedFormat: string = 'pdf';
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
      private dataService: DataService,
      private dialog: MatDialog
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

  onPreview(): void {
    const dialogRef = this.dialog.open(ProductPreviewDialogComponent, {
      width: '80%',
      height: '80%',
      data: this.productList,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('products popup closed', result);
      }
    });
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

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  downloadFile(): void {
    switch (this.selectedFormat) {
      case 'pdf':
        this.downloadPDF();
        break;
      case 'csv':
        this.downloadCSV();
        break;
      case 'xlsx':
        this.downloadXLSX();
        break;
      case 'word':
        this.downloadWord();
        break;
      default:
        alert('Unsupported file format');
        break;
    }
  }

  // PDF download method
  downloadPDF(): void {
    const doc = new jsPDF();
    const headers = [['Name', 'Price', 'Quantity', 'Color', 'Model Year']];
    const data = this.productList.map(product => [
      product.product_Name, product.list_Price, product.quantity, product.color, product.model_Year
    ]);
    doc.text('Our Shopsy Products List', 14, 10);
    autoTable(doc, { head: headers, body: data, startY: 20 });
    doc.save('ProductList.pdf');
  }

  // CSV download method
  downloadCSV(): void {
    const csvData = this.productList.map(product => ({
      Name: product.product_Name,
      Price: product.list_Price,
      Quantity: product.quantity,
      Color: product.color,
      ModelYear: product.model_Year
    }));
    const csv = this.convertToCSV(csvData);
    const blob = new Blob([csv], { type: 'text/csv' });
    saveAs(blob, 'ProductList.csv');
  }

  // Convert JSON to CSV
  convertToCSV(json: any[]): string {
    const keys = Object.keys(json[0]);
    const csv = [
      keys.join(','),
      ...json.map(row => keys.map(key => row[key]).join(','))
    ].join('\n');
    return csv;
  }

  // XLSX download method
  downloadXLSX(): void {
    const worksheet = XLSX.utils.json_to_sheet(this.productList);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ProductList');
    XLSX.writeFile(workbook, 'ProductList.xlsx');
  }

  // Word download method
  downloadWord(): void {
    const doc = new docxtemplater();
    const content = `
      <table>
        <thead>
          <tr><th>Name</th><th>Price</th><th>Quantity</th><th>Color</th><th>Model Year</th></tr>
        </thead>
        <tbody>
          ${this.productList.map(product => `
            <tr>
              <td>${product.product_Name}</td>
              <td>${product.list_Price}</td>
              <td>${product.quantity}</td>
              <td>${product.color}</td>
              <td>${product.model_Year}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    `;
    const blob = new Blob([content], { type: 'application/msword' });
    saveAs(blob, 'ProductList.docx');
  }

  // onPreview(product: Product): void {
  //   const dialogRef = this.dialog.open(ProductsListNewComponent, {
  //     width: '400px', // Adjust the size of the dialog as needed
  //     data: product  // Pass the product data to the dialog
  //   });
  
  //   // Optionally, you can handle the result when the dialog is closed
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       console.log('The dialog was closed with result:', result);
  //     }
  //   });
  // }  

  onReset(form: any): void {
    form.reset();
  }

  // reloadCurrentRoute() {
  //   let currentUrl = this.router.url;
  //   this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
  //       this.router.navigate([currentUrl]);
  //   });
  // }

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
