import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import { Observable } from 'rxjs';
import { ProductModel } from '../models/product-model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClient: HttpClient) {
  }

  getProducts(page: number, limit: number): Observable<ProductModel[]> {
    return this.httpClient.get<ProductModel[]>(`${environment.API_URL}/products?page=${page}&limit=${limit}`);
  }

  getProductsByCategory(catId: number, page: number, limit: number): Observable<ProductModel[]> {
    return this.httpClient.get<ProductModel[]>(`${environment.API_URL}/products?category=${catId}&page=${page}&limit=${limit}`);
  }

  getProduct(id: number): Promise<ProductModel> {
    return this.httpClient.get<ProductModel>(`${environment.API_URL}/products/${id}`).toPromise();
  }

}
