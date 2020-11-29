import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { OrderResponseModel } from '../models/order-response-model';
import { CartService } from './cart.service';

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: 'Bearer ' + localStorage.getItem('token')
  })
};

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private httpClient: HttpClient, private cartService: CartService) { }

  sendOrder(): Promise<OrderResponseModel> {
    // creating order object of the cart items
    const order = this.cartService.createOrder();
    return this.httpClient.post<OrderResponseModel>(`${environment.API_URL}/orders`, order, httpOptions).toPromise();
  }

  getOrder(id: number): Promise<OrderResponseModel> {
    return this.httpClient.get<OrderResponseModel>(`${environment.API_URL}/orders/${id}`, httpOptions).toPromise();
  }

}
