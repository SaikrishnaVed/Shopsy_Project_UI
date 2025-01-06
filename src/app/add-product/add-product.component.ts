import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements OnInit {
  product = {
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
  isLoading = false;
  categories: any;
  brands: any;
  selectedFile: File | null = null;
  isAddingNewBrand = false;
  newBrandName = '';
  isAddingNewCategory = false;
  newCategoryName = '';
  isEditMode: boolean = false;
  isAdmin = false;

  constructor(private appService: AppService, private router: Router) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.isAdmin = localStorage.getItem('role') === 'admin' ? true : false;
    this.isEditMode = Boolean(localStorage.getItem('isEditMode'));
    if(this.isEditMode){
      const productData = localStorage.getItem('editProduct');
      if (productData) {
        this.product = JSON.parse(productData);
      }
    }
    // this.selectedFile. = this.product.imagePath
    this.loadCategories();
    this.loadBrands();
    this.isLoading = false;
  }

  loadCategories(): void {
    this.appService.GetAllCategories().subscribe({
      next: (response: any) => {
        this.categories = response;
      },
      error: (err) => {
        console.error('Error fetching categories', err);
      },
    });
  }

  loadBrands(): void {
    this.appService.GetAllBrands().subscribe({
      next: (response: any) => {
        this.brands = response;
      },
      error: (err) => {
        console.error('Error fetching brands', err);
      },
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(form: any): void {
    this.isLoading = true;
    if (form.valid) {
      if (this.selectedFile) {
        this.product.imagePath = 'assets/' + this.selectedFile.name;
      }
  
      if (this.product.product_Id) {
        // Update product
        this.appService.UpdateProduct(this.product).subscribe({
          next: () => {
            this.isLoading = false;
            alert('Product updated successfully!');
            localStorage.removeItem('editProduct'); // Clear localStorage
            this.router.navigate(['/products']);
          },
          error: (err) => {
            this.isLoading = false;
            console.error('Error updating product', err);
            alert('Failed to update product. Please try again.');
          },
        });
      } else {
        // Add new product
        this.appService.AddProduct(this.product).subscribe({
          next: () => {
            this.isLoading = false;
            alert('Product added successfully!');
            localStorage.removeItem('editProduct'); // Clear localStorage
            this.onReset(form);
          },
          error: (err) => {
            this.isLoading = false;
            console.error('Error adding product', err);
            alert('Failed to add product. Please try again.');
          },
        });
      }
    } else {
      this.isLoading = false;
      alert('Please fill all required fields correctly.');
    }
  }
  

  onReset(form: any): void {
    form.reset();
  }

  onBrandChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    if (selectedValue === 'new') {
      this.isAddingNewBrand = true;
    } else {
      this.isAddingNewBrand = false;
    }
  }
  
  addNewBrand(): void {
    if (this.newBrandName.trim()) {
      const newBrand = { brand_Id: 0, brand_Name: this.newBrandName };
      this.appService.AddBrand(newBrand).subscribe({
        next: (response: any) => {
          alert('New brand added successfully!');
          this.brands.push(response); // Assuming the API returns the new brand object
          this.newBrandName = '';
          this.isAddingNewBrand = false;
          this.product.brand_Id = response.brand_Id; // Set the new brand as selected
        },
        error: (err) => {
          console.error('Error adding new brand', err);
          alert('Failed to add new brand. Please try again.');
        },
      });
    } else {
      alert('Please enter a valid brand name.');
    }
  }

  onCategoryChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    if (selectedValue === 'new') {
      this.isAddingNewCategory = true;
    } else {
      this.isAddingNewCategory = false;
    }
  }

  addNewcategory(): void {
    if (this.newCategoryName.trim()) {
      const newCategory = { category_Id: 0, category_Name: this.newCategoryName };
      this.appService.AddCategory(newCategory).subscribe({
        next: (response: any) => {
          alert('New category added successfully!');
          this.categories.push(response);
          this.newCategoryName = '';
          this.isAddingNewCategory = false;
           // Set the new brand as selected
          this.product.category_Id = response.category_Id;
        },
        error: (err) => {
          console.error('Error adding new category', err);
          alert('Failed to add new category. Please try again.');
        },
      });
    } else {
      alert('Please enter a valid category name.');
    }
  }

}