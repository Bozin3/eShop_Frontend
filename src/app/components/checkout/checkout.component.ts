import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartData } from 'src/app/models/cart-data';
import { CartDataModel } from 'src/app/models/cart_data_model';
import { OrderResponseModel } from 'src/app/models/order-response-model';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  cartProducts: CartDataModel[] = [];
  cartTotal = 0;
  checkoutInProgress = false;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router) { }

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

  checkout(): void {
    this.checkoutInProgress = true;
    this.orderService.sendOrder().then((orderResponse: OrderResponseModel) => {
      this.cartService.resetCartData();
      this.router.navigate(['/thankyou'], { state: { orderId: orderResponse.id} });
    })
    .catch(err => {
      this.checkoutInProgress = false;
      console.log(err);
    });
  }

}
