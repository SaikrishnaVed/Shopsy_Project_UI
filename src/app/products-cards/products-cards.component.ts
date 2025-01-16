import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { CartItem } from '../cart/cart.component';
import { Subscription } from 'rxjs';
import { DataService } from '../data.service';

@Component({
  selector: 'app-products-cards',
  templateUrl: './products-cards.component.html',
  styleUrls: ['./products-cards.component.css']
})
export class ProductsCardsComponent implements OnInit {
  userMessage: string = '';
  messages: string[] = [];
  filteredProductList: Product[] = [];
  selectedPriceRanges: string[] = [];
  slideshowImages: string[] = [
    'assets/megasale.jpg',
    'assets/familyshopping2.jpg',
    'assets/blackfriday2.jpg',
    'assets/card.jpg',
    'assets/brands.jpg',
    'assets/allshopping.jpg',
    // 'assets/feedback.jpg',
  ];
  currentSlideIndex: number = 0;
  slideshowInterval: any;
  constructor(private appService: AppService, private router: Router, private dataService: DataService) { }

  productList: Product[] = [];
  isLoading = false;
  filter = {
    pageNumber: 1,
    pageSize: 10,
    SearchTerm: "",
    SortBy: "",
    IsAscending: false,
    Skip: 0,
    isAdminTable: false
  };
  private subscription: Subscription;
  userId: number;

  ngOnInit(): void {
    // Slide show
    this.startSlideshow();

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

  startSlideshow(): void {
    this.slideshowInterval = setInterval(() => {
      this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slideshowImages.length;
    }, 2000);
  }

  togglePriceRange(range: string): void {
    const index = this.selectedPriceRanges.indexOf(range);
    if (index === -1) {
      this.selectedPriceRanges.push(range);
    } else {
      this.selectedPriceRanges.splice(index, 1);
    }
    this.applyFilters();
  }

  applyFilters(): void {
    if (this.selectedPriceRanges.length === 0) {
      this.filteredProductList = [...this.productList]; // No filters applied
      return;
    }

    this.filteredProductList = this.productList.filter((product) => {
      return this.selectedPriceRanges.some((range) => {
        const [min, max] = range.split('-').map(Number);
        if(max < 10000)
          return product.list_Price >= min && product.list_Price <= max;
        else
          return product.list_Price >= min;
      });
    });
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
          this.filteredProductList = this.productList;
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
    this.userId = Number(sessionStorage.getItem('userId'));
    product.cartcount = 1;
      const cartItem = {
        userId: this.userId,
        product_Id: product.product_Id,
        Quantity: 1,
      };

      this.appService.AddCartItem(cartItem).subscribe({
        next: () => {
          //this.isLoading = false;
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
      const updatedCartItem = {
        cart_Id: 0,
        userId: Number(sessionStorage.getItem('userId')),
        product_Id: product.product_Id,
        Quantity: product.cartcount,
      };
      this.appService.UpdateCartItem(product.product_Id, updatedCartItem).subscribe({
        next: () => {
          //this.isLoading = false;
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
    // if(product.cartcount == 1)
    //   this.removeFromCart(product);
    // else{
      // //this.isLoading = true;
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
            //this.isLoading = false;
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

  trackByProductID(index: number, product: any): string {
    return product.product_Id;
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
    const wishItem = { Id: -1, productid: product.product_Id, userId: Number(sessionStorage.getItem('userId')), Isfavourite: product.isfavourite };
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
  list_Price: number;
  quantity: number;
  color: string;
  imagePath: string;
  cartCount: number;
  cartcount: number;
  isfavourite: boolean;
}