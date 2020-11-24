import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { OrderRequestModel } from '../models/order-request-model';
import { OrderResponseModel } from '../models/order-response-model';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private userId = 1;

  constructor(private httpClient: HttpClient, private cartService: CartService) { }

  sendOrder(): Promise<OrderResponseModel> {
    // creating order object of the cart items
    const order = this.cartService.createOrder();
    return this.httpClient.post<OrderResponseModel>(`${environment.API_URL}/orders`, order).toPromise();
  }

  getOrder(id: number): Promise<OrderResponseModel> {
    // creating order object of the cart items
    const order = this.cartService.createOrder();
    return this.httpClient.get<OrderResponseModel>(`${environment.API_URL}/orders/${id}`).toPromise();
  }

}
