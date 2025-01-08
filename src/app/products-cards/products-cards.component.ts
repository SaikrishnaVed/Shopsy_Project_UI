import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { CartItem } from '../cart/cart.component';
import { Subscription } from 'rxjs';
import { DataService } from '../data.service';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-products-cards',
  templateUrl: './products-cards.component.html',
  styleUrls: ['./products-cards.component.css']
})
export class ProductsCardsComponent implements OnInit {
  userMessage: string = '';
  messages: string[] = [];

  constructor(private appService: AppService, private router: Router, private dataService: DataService, private chatservice: ChatService) { }

  // cartCount: number;
  productList: Product[] = [];
  isLoading = false;
  filter = {
    pageNumber: 1,
    pageSize: 10,
    SearchTerm: "",
    SortBy: "",
    IsAscending: false,
    Skip: 0,
    // isWishListFilter: false
  };
  private subscription: Subscription;
  userId: number;

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

  // Get list of products
  GetProductList(): void {
    this.isLoading = true;
    this.appService.GetAllProducts(this.filter).subscribe({
      next: (response: any) => {
        //this.isLoading = false;
        if (response && response?.items) {
          this.productList = response.items.map((product: Product) => ({
            ...product,
          }));
          console.log(this.productList);
        } else {
          console.error('No items in response');
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.router.navigate(['/login']);
      },
    });
  }

  // Add item to cart
  addToCart(product: Product): void {
    //this.isLoading = true;
    this.userId = Number(localStorage.getItem('userId'));
    product.cartcount = 1;
    // if (product.cartCount === 0) {
      const cartItem = {
        userId: this.userId,
        product_Id: product.product_Id,
        Quantity: 1,
      };

      this.appService.AddCartItem(cartItem).subscribe({
        next: () => {
          //this.isLoading = false;
          // product.cartCount = 1;
          // this.cartCount = 1;
          console.log('Item added to cart');
        },
        error: (err) => {
          //this.isLoading = false;
          console.error('Error adding item to cart:', err);
        },
      });
    // }
  }

  // Increment item count in cart
  incrementCount(product: Product): void {
    //this.isLoading = true;
    product.cartcount++;
    if (product.cartcount < product.quantity) {
      // product.cartCount++;
      const updatedCartItem = {
        cart_Id: 0,
        userId: Number(localStorage.getItem('userId')),
        product_Id: product.product_Id,
        Quantity: product.cartcount,
      };
      this.appService.UpdateCartItem(product.product_Id, updatedCartItem).subscribe({
        next: () => {
          //this.isLoading = false;
          // this.cartCount++;  // Increment cart count in UI
          console.log('Cart item incremented');
        },
        error: (err) => {
          //this.isLoading = false;
          console.error('Error incrementing cart item:', err);
        },
      });
    }
  }

  // Decrement item count in cart
  decrementCount(product: Product): void {
    // //this.isLoading = true;
    if (product.cartcount >= 1) {
      product.cartcount--;
      // product.cartCount--;
      // if(product.cartcount == 0){
      //   this.removeFromCart(product);
      // }
      // else{
      const updatedCartItem = {
        cart_Id: 0,
        userId: Number(localStorage.getItem('userId')),
        product_Id: product.product_Id,
        Quantity: product.cartcount,
      };
      // product.product_id hardcoded to 3 for testing.
      this.appService.UpdateCartItem(product.product_Id, updatedCartItem).subscribe({
        next: () => {
          //this.isLoading = false;
          // this.cartCount--;
          // product.cartCount--;
          console.log('Cart item decremented');
        },
        error: (err) => {
          //this.isLoading = false;
          console.error('Error decrementing cart item:', err);
        },
      });
    }
    else{
      //this.isLoading = false;
    }
    // }
  }

  // Remove item from cart
  removeFromCart(product: Product): void {
    // //this.isLoading = true;
    product.cartcount = 0;
    this.appService.DeleteCartItem(product.product_Id).subscribe({
      next: () => {
        //this.isLoading = false;
        // this.cartCount = 0;
        // product.cartCount = 0;
        console.log('Item removed from cart');
      },
      error: (err) => {
        //this.isLoading = false;
        console.error('Error removing item from cart:', err);
      },
    });
  }

  toggleWishlist(product: any): void {
    product.isfavourite = !product.isfavourite;
    const wishItem = { Id: 0, productid: product.product_Id, userId: Number(localStorage.getItem('userId')), Isfavourite: product.isfavourite };

    // if (product.isfavourite) {
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
          product.isfavourite = !product.isfavourite;
          alert('Failed to add to wishlist.');
        },
      });
    // } else {
    //   // Remove from wishlist logic if needed
    //   alert(`${product.product_Name} removed from wishlist.`);
    // }
  }

  productPage(product_Id: number): void {
    this.appService.GetProductById(product_Id).subscribe({
      next: (response: any) => {
        if (response) {
          localStorage.setItem('productPageId', product_Id.toString());
          //redirect to product page component.
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