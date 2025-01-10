import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { ProductsListComponent } from './products-list/products-list.component';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatIconModule} from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { RegisterComponent } from './register/register.component';
import { ProductsCardsComponent } from './products-cards/products-cards.component';
import { CartComponent } from './cart/cart.component';
import { DecimalFormatPipe } from './decimal-format.pipe';
import { AddProductComponent } from './add-product/add-product.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductPageComponent } from './product-page/product-page.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ProductsListNewComponent } from './products-list-new/products-list-new.component';
import { WishListProductsComponent } from './wish-list-products/wish-list-products.component';
import { UserListComponent } from './user-list/user-list.component';
import { MatSelectModule } from '@angular/material/select';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { DateFormatPipe } from './date-format.pipe';
import { MatDialogModule } from '@angular/material/dialog';
import { ProductPreviewDialogComponent } from './product-preview-dialog/product-preview-dialog.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductsListComponent,
    LoginComponent,
    RegisterComponent,
    ProductsCardsComponent,
    CartComponent,
    DecimalFormatPipe,
    AddProductComponent,
    ProductPageComponent,
    ProductsListNewComponent,
    WishListProductsComponent,
    UserListComponent,
    ProfilePageComponent,
    DateFormatPipe,
    ProductPreviewDialogComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    LoaderComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatSelectModule,
    MatDialogModule,
    MatStepperModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule { }