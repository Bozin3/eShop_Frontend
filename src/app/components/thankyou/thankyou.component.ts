import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderRequestModel } from 'src/app/models/order-request-model';
import { OrderResponseModel } from 'src/app/models/order-response-model';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.css']
})
export class ThankyouComponent implements OnInit {

  private orderResponseId: number;
  orderResponseModel: OrderResponseModel;
  orderTotalValue = 0;

  constructor(private router: Router, private orderService: OrderService) {
    const currentState = this.router.getCurrentNavigation();
    if (currentState.extras.state !== undefined) {
      this.orderResponseId = currentState.extras.state.orderId;
    } else {
      // if there are no extras , navigate to home component
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.orderService.getOrder(this.orderResponseId)
    .then((orderModel: OrderResponseModel) => {
      this.orderResponseModel = orderModel;
      this.calculateTotal();
    })
    .catch((err) => console.log(err));
  }

  private calculateTotal(): void {
    let total = 0;
    for (const productDetail of this.orderResponseModel.ordersDetails) {
      total = total + (productDetail.quantity * productDetail.price);
    }
    this.orderTotalValue = total;
  }

}
