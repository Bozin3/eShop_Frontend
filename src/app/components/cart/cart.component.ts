import { Component, OnInit } from '@angular/core';
import { CartData } from 'src/app/models/cart-data';
import { CartDataModel } from 'src/app/models/cart_data_model';
import { ProductModel } from 'src/app/models/product-model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cartProducts: CartDataModel[] = [];
  cartTotal = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.getCartData();
  }

  getCartData(): void {
    this.cartService.cartDataSubject.subscribe((cartData: CartData) => {
      if (cartData != null) {
        console.log('cart data:');
        console.log(cartData.data);
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

}
