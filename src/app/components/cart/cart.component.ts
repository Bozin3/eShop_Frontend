import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
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

  constructor(private cartService: CartService, private toast: ToastrService) { }

  ngOnInit(): void {
    this.getCartData();
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
    if (this.cartService.deleteCartProduct(product)) {
      this.toast.error(`${product.title} is removed from cart`, 'Product removed', {
        timeOut: 1000,
        progressBar: false,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right'
      });
    }
  }
}
