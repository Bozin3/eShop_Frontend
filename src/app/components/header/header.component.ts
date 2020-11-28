import { Component, OnInit } from '@angular/core';
import { CartData } from 'src/app/models/cart-data';
import { CartDataModel } from 'src/app/models/cart_data_model';
import { ProductModel } from 'src/app/models/product-model';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  cartProducts: CartDataModel[] = [];
  cartTotal = 0;

  loggedIn: boolean;

  constructor(private cartService: CartService, private authService: AuthService) { }

  ngOnInit(): void {
    this.getCartData();
    this.authService.loggedIn.subscribe((loggedIn) => {
      this.loggedIn = loggedIn;
    });
  }

  getCartData(): void {
    this.cartService.cartDataSubject.subscribe((cartData: CartData) => {
      if (cartData != null) {
        this.cartProducts = cartData.data;
        this.cartTotal = this.cartService.calculateCartTotal();
      }
    });
  }

  incrementCartProduct(product: ProductModel): void {
    this.cartService.incrementQuantity(product);
  }

  decrementCartProduct(product: ProductModel): void {
    this.cartService.decrementQuantity(product);
  }

  deleteCartProduct(product: ProductModel): void {
    this.cartService.deleteCartProduct(product);
  }

  logout(): void {
    this.authService.logout();
  }

}
