import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css'],
})
export class ProductPageComponent implements OnInit {
  product: any;
  isLoading = false;
  productId: number;
  staticComments = [
    { user: 'John Doe', comment: 'Great product! Highly recommend.', rating: 5 },
    { user: 'Jane Smith', comment: 'Good value for money.', rating: 4 },
    { user: 'David Wilson', comment: 'Satisfactory performance.', rating: 3 },
  ];
  dynamicComments: any[];
  productList: Product[] = [];
  userId: number;
  newRating = 0;
  newComment = '';
  constructor(
    private appService: AppService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.userId = Number(sessionStorage.getItem('userId'));
    this.productId = Number(sessionStorage.getItem('productPageId'));
    if (this.productId) {
      this.getProductDetails(this.productId);
      this.fetchFeedbacks(this.productId);
    } else {
      alert('Invalid Product ID');
      this.router.navigate(['/allproducts']);
    }
    this.isLoading = false;
  }

  getProductDetails(productId: number): void {
    this.appService.GetProductById(productId).subscribe({
      next: (response) => {
        this.product = response;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching product details:', err);
        alert('Error fetching product details.');
        this.router.navigate(['/allproducts']);
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
        this.isLoading = false;
      }
    } 

    toggleWishlist(product: any): void {
      product.isfavourite = !product.isfavourite;
      const wishItem = { Id: 0, productid: product.product_Id, userId: Number(sessionStorage.getItem('userId')), Isfavourite: product.isfavourite };
  
        this.appService.AddToWishList(wishItem).subscribe({
          next: () => {
            this.productList.forEach((p) => {
              if (p.product_Id === product.product_Id) {
                p.isfavourite = product.isfavourite == 'true' ? true : false;
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

    fetchFeedbacks(product_Id: any): void {
      this.appService.GetAllFeedbacks(product_Id).subscribe({
        next: (response) => {
          this.dynamicComments = response;     
            this.dynamicComments.forEach((c) => {
              if (c.userId === this.userId) {
                this.newComment = c.comments;
                this.newRating = c.rating;
              }
            });

          sessionStorage.setItem('productPageCardData', response);
        },
        error: (err) => {
          console.error('Error fetching feedbacks:', err);
        },
      });
    }

    addFeedback(): void {
      
      if (this.newRating === 0 || this.newComment.trim() === '') {
        alert('Please provide both a rating and a comment.');
        return;
      }
      
      const feedback = {
        Id: 0,
        rating: this.newRating,
        comments: this.newComment.trim(),
        userId: Number(sessionStorage.getItem('userId')),
        product_Id: this.productId,
        DateCreated: new Date(),
        username: sessionStorage.getItem('username'),
      };
      if (confirm('Are you sure you want to update this feedback?')) {
        this.appService.AddOrUpdateFeedback(feedback).subscribe({
        next: () => {
          alert('Feedback added successfully');
          this.dynamicComments.push(feedback);
          this.newRating = 0;
          this.newComment = '';
          this.fetchFeedbacks(feedback.product_Id);
        },
        error: (err) => {
          console.error('Error adding feedback:', err);
          alert('Failed to add feedback.');
        },
        });
      }
    }

    deleteFeedback(feedback: any): void {
      if (confirm('Are you sure you want to delete this feedback?')) {
        this.appService.DeleteFeedback(feedback).subscribe({
          next: () => {
            alert('Feedback deleted successfully.');
            this.dynamicComments = this.dynamicComments.filter((f) => f.Id !== feedback.Id);
            this.fetchFeedbacks(feedback.product_Id);
          },
          error: (err) => {
            console.error('Error deleting feedback:', err);
            alert('Failed to delete feedback.');
          },
        });
      }
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

export class Feedback {
  Id: number;
  rating: number;
  comments: string;
  userId: number;
  product_Id: number;
  DateCreated: Date;
  username: string
}