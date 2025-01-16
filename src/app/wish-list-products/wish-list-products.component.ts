import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wish-list-products',
  templateUrl: './wish-list-products.component.html',
  styleUrls: ['./wish-list-products.component.css']
})
export class WishListProductsComponent implements OnInit {
userMessage: string = '';
  messages: string[] = [];

  constructor(private appService: AppService, private router: Router, private dataService: DataService) { }

  ngOnInit(): void {
    this.filter.isWishListFilter = true;
    this.isLoading = true;
    this.subscription = this.dataService.currentMessage.subscribe(
      (message: string) => {
        this.filter.SearchTerm = message;
        this.GetProductList();
      }
    );
    this.isLoading = false;
  }
  
  productList: Product[] = [];
  isLoading = false;
  filter = {
    pageNumber: 1,
    pageSize: 10,
    SearchTerm: "",
    SortBy: "",
    IsAscending: false,
    Skip: 0,
    isWishListFilter: true,
    isAdminTable: false
  };
  private subscription: Subscription;
  userId: number;

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  trackByProductID(index: number, product: any): string {
    return product.product_Id;
  }

  // Get list of products
  GetProductList(): void {
    this.appService.GetAllProducts(this.filter).subscribe({
      next: (response: any) => {
        if (response && response?.items) {
          this.productList = response.items.map((product: Product) => ({
            ...product,
          }));
          
        } else {
          console.error('No items in response');
        }
      },
      error: (err) => {
        this.router.navigate(['/login']);
      },
    });
  }

  // Add item to cart
  addToCart(product: Product): void {
    this.userId = Number(sessionStorage.getItem('userId'));
    product.cartcount = 1;
      const cartItem = {
        userId: this.userId,
        product_Id: product.product_Id,
        Quantity: 1,
      };

      this.appService.AddCartItem(cartItem).subscribe({
        next: () => {
          console.log('Item added to cart');
        },
        error: (err) => {
          console.error('Error adding item to cart:', err);
        },
      });
  }

  // Increment item count in cart
  incrementCount(product: Product): void {
    product.cartcount++;
    if (product.cartcount < product.quantity) {
      const updatedCartItem = {
        cart_Id: 0,
        userId: Number(sessionStorage.getItem('userId')),
        product_Id: product.product_Id,
        Quantity: product.cartcount,
      };
      this.appService.UpdateCartItem(product.product_Id, updatedCartItem).subscribe({
        next: () => {
          console.log('Cart item incremented');
        },
        error: (err) => {
          console.error('Error incrementing cart item:', err);
        },
      });
    }
  }

  // Decrement item count in cart
  decrementCount(product: Product): void {
    if (product.cartcount >= 1) {
      product.cartcount--;
      const updatedCartItem = {
        cart_Id: 0,
        userId: Number(sessionStorage.getItem('userId')),
        product_Id: product.product_Id,
        Quantity: product.cartcount,
      };
      this.appService.UpdateCartItem(product.product_Id, updatedCartItem).subscribe({
        next: () => {
          console.log('Cart item decremented');
        },
        error: (err) => {
          console.error('Error decrementing cart item:', err);
        },
      });
    }
    else{
      //this.isLoading = false;
    }
  }

  // Remove item from cart
  removeFromCart(product: Product): void {
    product.cartcount = 0;
    this.appService.DeleteCartItem(product.product_Id).subscribe({
      next: () => {
        console.log('Item removed from cart');
      },
      error: (err) => {
        console.error('Error removing item from cart:', err);
      },
    });
  }

  toggleWishlist(product: any): void {
    product.isfavourite = !product.isfavourite;
    const wishItem = { Id: 0, productid: product.product_Id, userId: Number(sessionStorage.getItem('userId')), Isfavourite: product.isfavourite };

      this.appService.AddToWishList(wishItem).subscribe({
        next: () => {
          this.productList.forEach((p) => {
            if (p.product_Id === wishItem.productid) {
              p.isfavourite = wishItem.Isfavourite;
            }
          });

          if(wishItem.Isfavourite == true)
            alert(`${product.product_Name} added to wishlist.`);
          else
            alert(`${product.product_Name} removed from wishlist.`);
        },
        error: () => {
          product.Isfavourite = !product.Isfavourite;
          alert('Failed to add to wishlist.');
        },
      });
  }

  productPage(product_Id: number): void {
    this.appService.GetProductById(product_Id).subscribe({
      next: (response: any) => {
        if (response) {
          sessionStorage.setItem('productPageId', product_Id.toString());
          this.router.navigate(['/productPage']);
        }
        else{
          alert('No data found.');
        }
      },
      error: (err) => {
        console.error('Error while product details:', err);
      },
    });
  }
  
}

export class Product {
  product_Id: number;
  product_name: string;
  brand_id: number;
  category_id: number;
  model_year: number;
  list_price: number;
  quantity: number;
  color: string;
  imagePath: string;
  cartCount: number;
  cartcount: number;
  isfavourite: boolean;
}