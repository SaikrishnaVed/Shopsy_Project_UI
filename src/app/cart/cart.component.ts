import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: any;
  totalAmount: number = 0;
  discountedAmount: number = 0;
  isLoading = false;
  isCheckOut: boolean = false;
  isCouponApplied: boolean = false;
  appliedCoupon: Coupon | null = null;
  availableCoupons: Coupon[] = [];
  validCoupons: Coupon[] = [];
  couponCode: string = '';
  userId = Number(sessionStorage.getItem('userId'));
  
  PurchaseOrder = {
    Id: 0,
    Product_Id: 0,
    Quantity: 0,
    userId: 0,
    price: 0,
    DateCreated: new Date()
  };

  constructor(private appService: AppService, private router: Router) {}

  ngOnInit(): void {
    this.loadCartItems();
    this.loadCoupons();
  }

  // Load cart items from the backend
  loadCartItems(): void {
    this.appService.GetCartItems().subscribe({
      next: (response: any) => {
        this.cartItems = response.map((cartItem: any) => ({
          cart_Id: cartItem.cart_Id,
          userId: cartItem.userId,
          product_id: cartItem.product_Id,
          product_name: cartItem.products[0]?.product_Name,
          list_price: cartItem.products[0]?.list_Price,
          color: cartItem.products[0]?.color,
          imagePath: cartItem.products[0]?.imagePath,
          count: cartItem.quantity,
        }));
        this.calculateTotalAmount(); // Recalculate total amount
      },
      error: (err) => {
        console.error('Error fetching cart items:', err);
      },
    });
  }

  // Increment item quantity
  incrementItem(item: CartItem): void {
    const updatedItem = {
      Cart_Id: item.cart_Id,
      Quantity: item.count + 1,
      product_Id: item.product_id,
      userId: Number(sessionStorage.getItem('userId'))
    };

    this.appService.UpdateCartItem(item.cart_Id, updatedItem).subscribe({
      next: () => {
        item.count += 1;
        this.calculateTotalAmount(); // Recalculate total amount after update
      },
      error: (err) => {
        console.error('Error incrementing cart item:', err);
      },
    });
  }

  // Decrement item quantity
  decrementItem(item: CartItem): void {
    if (item.count > 1) {
      const updatedItem = {
        Cart_Id: item.cart_Id,
        Quantity: item.count - 1,
        product_Id: item.product_id,
        userId: Number(sessionStorage.getItem('userId'))
      };

      this.appService.UpdateCartItem(item.cart_Id, updatedItem).subscribe({
        next: () => {
          item.count -= 1;
          this.calculateTotalAmount(); // Recalculate total amount after update
        },
        error: (err) => {
          console.error('Error decrementing cart item:', err);
        },
      });
    } else {
      this.removeItem(item);
    }
  }

  // Remove an item from the cart
  removeItem(item: CartItem): void {
    if (confirm('Are you sure you want to delete items?')) {
      this.appService.DeleteCartItem(item.cart_Id).subscribe({
        next: () => {
          this.cartItems = this.cartItems.filter((cartItem) => cartItem.cart_Id !== item.cart_Id);
          this.calculateTotalAmount();
        },
        error: (err) => {
          console.error('Error removing cart item:', err);
        },
      });
    }
  }

  // Proceed to checkout
  checkout(): void {
    const userId = Number(sessionStorage.getItem('userId'));

    if (!userId || !this.cartItems || this.cartItems.length === 0) {
      alert('No items in the cart to checkout.');
      return;
    }

    const purchaseOrders: PurchaseOrder[] = this.cartItems.map((item: CartItem) => ({
      Id: 0,
      Product_Id: item.product_id,
      Quantity: item.count,
      userId: userId,
      price: item.list_price,
      DateCreated: new Date(),
      TotalToPay: this.totalAmount,
      DiscountedAmount: this.discountedAmount
    }));
    if (confirm('Are you sure you want to checkout?')) {
    this.appService.AddBulkPurchaseOrders(purchaseOrders).subscribe({
      next: () => {
        alert('Checkout completed successfully!');
        this.isCheckOut = true;
        this.loadCartItems();
      },
      error: (err) => {
        console.error('Error during checkout:', err);
        alert('Failed to complete checkout. Please try again.');
      },
    });

    const couponUsage = {
      Id: 0,
      Coupon_Id: this.appliedCoupon.id,
      couponLimit: this.appliedCoupon.usage_limit,
      couponUsed: this.appliedCoupon.couponUsed === 0 ? 1 : this.appliedCoupon.couponUsed,
      user_Id: userId,
      Usage_Date: new Date(),
    };

    this.appService.AddToCouponUsage(couponUsage).subscribe({
      next: () => {
        console.log('Added to coupon usage.');
      },
      error: (err) => {
        console.error('Error during checkout:', err);
        alert('Failed to complete checkout. Please try again.');
      },
    });
  }
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

  // Fetch available coupons
  loadCoupons(): void {
    this.appService.GetAllCoupons(this.userId).subscribe({
      next: (response: any) => {
        this.availableCoupons = response;
        this.applyValidCoupons();
      },
      error: (err) => {
        console.error('Error fetching coupons:', err);
      },
    });
  }

  // Apply the coupon entered by the user
  // applyCoupon(): void {
  //   const coupon = this.availableCoupons.find(c => c.code === this.couponCode.trim());
    
  //   if (coupon) {
  //     const currentDate = new Date();
  //     const startDate = new Date(coupon.start_date);
  //     const endDate = new Date(coupon.end_date);

  //     if (currentDate >= startDate && currentDate <= endDate && coupon.status === 'active') {
  //       this.appliedCoupon = coupon; // Set the applied coupon
  //       this.couponCode = ''; // Clear the input
  //       this.calculateTotalAmount(); // Recalculate total with the coupon applied
  //       alert(`Coupon ${coupon.code} applied successfully!`);
  //     } else {
  //       alert('This coupon is not valid or expired.');
  //     }
  //   } else {
  //     alert('Invalid coupon code.');
  //   }
  // }

  applyCoupon(): void {
    const coupon = this.availableCoupons.find(
      (c) => c.code === this.couponCode.trim()
    );

    if (coupon) {
      const currentDate = new Date();
      const startDate = new Date(coupon.start_date);
      const endDate = new Date(coupon.end_date);

      if (
        currentDate >= startDate &&
        currentDate <= endDate &&
        coupon.status === 'active'
      ) {
        this.appliedCoupon = coupon; // Set the applied coupon
        this.couponCode = ''; // Clear the input
        this.calculateTotalAmount(); // Recalculate total with the coupon applied

        // Trigger animation
        this.isCouponApplied = true;
        setTimeout(() => {
          this.isCouponApplied = false; // Reset animation class
        }, 1000);

        alert(`Coupon ${coupon.code} applied successfully!`);
      } else {
        alert('This coupon is not valid or expired.');
      }
    } else {
      alert('Invalid coupon code.');
    }
  }

  // Remove the applied coupon
  removeCoupon(): void {
    this.appliedCoupon = null; // Remove the applied coupon
    this.calculateTotalAmount(); // Recalculate total without the coupon
    alert('Coupon removed successfully.');
  }

  // Calculate the total amount after applying/removing coupon
  calculateTotalAmount(): void {
    this.totalAmount = this.cartItems.reduce(
      (acc, item) => acc + item.list_price * item.count,
      0
    );

    if (this.appliedCoupon) {
      if (this.appliedCoupon.discount_type === 'percentage') {
        this.discountedAmount = (this.totalAmount * this.appliedCoupon.discount_value) / 100;
      } else if (this.appliedCoupon.discount_type === 'fixed') {
        this.discountedAmount = this.appliedCoupon.discount_value;
      }
      this.totalAmount -= this.discountedAmount;

      // Ensure the total amount doesn't go below zero
      this.totalAmount = Math.max(this.totalAmount, 0);
    }
  }

  // Filter and apply valid coupons
  applyValidCoupons(): void {
    const currentDate = new Date();
    this.validCoupons = this.availableCoupons.filter((coupon) => {
      const startDate = new Date(coupon.start_date);
      const endDate = new Date(coupon.end_date);
      return (
        currentDate >= startDate &&
        currentDate <= endDate &&
        coupon.status === 'active'
      );
    });
  }
}

export class CartItem {
  cart_Id: number;
  userId: number;
  product_id: number;
  product_name: string;
  list_price: number;
  color: string;
  imagePath: string;
  count: number;
}

export class PurchaseOrder {
  Id: number;
  Product_Id: number;
  Quantity: number;
  userId: number;
  price: number;
  DateCreated: Date;
}

export class Coupon {
  id: number;
  code: string;
  discount_type: string;
  discount_value: number;
  start_date: string;
  end_date: string;
  usage_limit: number;
  status: string;
  couponUsed: number;
}
