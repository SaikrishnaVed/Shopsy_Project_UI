import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CartItem } from './cart/cart.component';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  constructor(private http: HttpClient) { 
  }

  // Get Products
  GetAllProducts(filter: any): Observable<any> {
    const token =  sessionStorage.getItem('token'); // Replace with the actual token or retrieve dynamically.
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    var userId = Number(sessionStorage.getItem('userId'));
    return this.http.post(`https://localhost:44348/api/product/GetAll/${userId}`, filter,
      { headers });
  }

  // Get Products
  GetProductById(product_Id: any): Observable<any> {
    const token =  sessionStorage.getItem('token'); // Replace with the actual token or retrieve dynamically.
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    var userId = Number(sessionStorage.getItem('userId'));
    return this.http.get(`https://localhost:44348/api/product/GetById/${product_Id}/${userId}`,
      { headers });
  }

  // Login User.
  LoginUser(loginDetails: any): Observable<any> {
    return this.http.post(`https://localhost:44348/api/Auth/Login`, loginDetails);
  }
  //Register User.
  RegisterUser(registerDetails: any): Observable<any> {
    return this.http.post(`https://localhost:44348/api/Auth/Register`, registerDetails);
  }

  // Get all cart items
  GetCartItems(): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    var userId = Number(sessionStorage.getItem('userId'));

    return this.http.get(`https://localhost:44348/api/Cart/CartList?userId=${userId}`, { headers });
  }

  // Add an item to the cart
  AddCartItem(cartItem: any): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.post(`https://localhost:44348/api/Cart/addCartItem`, cartItem, { headers });
  }

  // Update an existing cart item
  UpdateCartItem(cartId: number, updatedCart: any): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.put(`https://localhost:44348/api/Cart/UpdateCart/${cartId}`, updatedCart, { headers });
  }

  // Delete a cart item
  DeleteCartItem(cartId: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.delete(`https://localhost:44348/api/Cart/DeleteCart/${cartId}`, { headers });
  }

  // Delete a cart item
  DeleteProductItem(product_Id: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.delete(`https://localhost:44348/api/Product/Delete/${product_Id}`, { headers });
  }

    // Add an item to the cart
    AddProduct(product: any): Observable<any> {
      const token = sessionStorage.getItem('token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      });

      return this.http.post(`https://localhost:44348/api/Product/Add`, product, { headers });
    }

    // Update an item to the cart
    UpdateProduct(product: any): Observable<any> {
      const token = sessionStorage.getItem('token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      });

      return this.http.post(`https://localhost:44348/api/Product/Update`, product, { headers });
    }

    // Add an item to the cart
    AddBulkPurchaseOrders(purchaseOrders: any[]): Observable<any> {
      const token = sessionStorage.getItem('token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      console.log(JSON.stringify(purchaseOrders));

      return this.http.post(`https://localhost:44348/api/PurchaseOrder/AddPurchaseOrders`, purchaseOrders, { headers });
    }

    // Add an item to the WishList
    AddToWishList(wishItem: any): Observable<any> {
      const token = sessionStorage.getItem('token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      return this.http.post(`https://localhost:44348/api/WishItem/AddWishItem`, wishItem, { headers });
    }

    // Get all Products Brands
    GetAllBrands(): Observable<any> {
      const token = sessionStorage.getItem('token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.get(`https://localhost:44348/api/brands/GetAllBrands`, { headers });
    }

    AddBrand(brand: any): Observable<any> {
      const token = sessionStorage.getItem('token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      return this.http.post<any>('https://localhost:44348/api/brands/AddBrand', brand, { headers });
    }  
    
    // Get all Products Categories
    GetAllCategories(): Observable<any> {
      const token = sessionStorage.getItem('token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.get(`https://localhost:44348/api/Category/GetAllCategories`, { headers });
    }

    AddCategory(category: any): Observable<any> {
      const token = sessionStorage.getItem('token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      return this.http.post<any>('https://localhost:44348/api/Category/AddCategory', category, { headers });
    }

    // Get all Product related Feedbacks
    GetAllFeedbacks(productId: number): Observable<any> {
      const token = sessionStorage.getItem('token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.get(`https://localhost:44348/api/Feedback/GetAllFeedbacks/${productId}`, { headers });
    }

    // Get all Product related Feedbacks
    AddOrUpdateFeedback(feedback: any): Observable<any> {
      const token = sessionStorage.getItem('token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.post(`https://localhost:44348/api/Feedback/AddEditFeedback`, feedback, { headers });
    }

    DeleteFeedback(feedback: any): Observable<any> {
      const token = sessionStorage.getItem('token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.post(`https://localhost:44348/api/Feedback/DeleteFeedback`, feedback, { headers });
    }
    
    // Get Products
  GetAllAuthUsers(): Observable<any> {
    const token =  sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    var userId = Number(sessionStorage.getItem('userId'));
    return this.http.get(`https://localhost:44348/api/Auth/AuthUserList`, { headers });
  }

  UpdateUserRole(updatedRole: any): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post(`https://localhost:44348/api/Auth/UpdateUserRole`, updatedRole, { headers });
  }

    // Get users
    GetUserById(userId: number): Observable<any> {
      const token =  sessionStorage.getItem('token'); // Replace with the actual token or retrieve dynamically.
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.get(`https://localhost:44348/api/Auth/GetAuthUserById/${userId}`, { headers });
    }
  
    UpdateUserDetails(updatedData: any): Observable<any> {
      const token =  sessionStorage.getItem('token'); // Replace with the actual token or retrieve dynamically.
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.post(`https://localhost:44348/api/Auth/UpdateUserProfile`, updatedData, { headers });
    }

  // Get Coupons
  GetAllCoupons(): Observable<any> {
    const token =  sessionStorage.getItem('token'); // Replace with the actual token or retrieve dynamically.
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(`https://localhost:44348/api/Coupons/GetCoupons`, { headers });
  }

  AddToCouponUsage(couponUsage: any): Observable<any> {
    const token =  sessionStorage.getItem('token'); // Replace with the actual token or retrieve dynamically.
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post(`https://localhost:44348/api/Coupons/AddToCouponUsage`, couponUsage, { headers });
  }

  forgotPassword(forgotPasswordRequest: any): Observable<any> {
    return this.http.post(`https://localhost:44348/api/Auth/ForgotPassword`, forgotPasswordRequest);
  }

  ResetPassword(ResetPasswordRequest: any): Observable<any> {
    return this.http.post(`https://localhost:44348/api/Auth/ResetPassword`, ResetPasswordRequest);
  }
}