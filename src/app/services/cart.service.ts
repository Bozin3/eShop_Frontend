import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartCache } from '../models/cart-cache';
import { CartCacheModel } from '../models/cart-cache-model';
import { CartData } from '../models/cart-data';
import { CartDataModel } from '../models/cart_data_model';
import { ProductModel } from '../models/product-model';
import { OrderService } from './order.service';
import { ProductService } from './product.service';
import { OrderRequestModel } from '../models/order-request-model';
import { OrderDetailsRequestModel } from '../models/order-request-details-model';
import { AuthService } from './auth.service';

const CART_ITEM_KEY = 'cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  // this model is used just for caching cart products (using only product id)
  private cartCache: CartCache = new CartCache();
  // this model is used for rendering and business logic
  private cartData: CartData = new CartData();

  cartDataSubject = new BehaviorSubject(null);

  constructor(private productsService: ProductService, private authService: AuthService) {
    this.getCartData();
  }

  public getCartData(): void {
    const cache = JSON.parse(localStorage.getItem(CART_ITEM_KEY));
    if (cache != null && cache.data != null) {
      this.cartCache = cache;
      this.cartCache.data.forEach((p) => { // load cart products data
          this.productsService.getProduct(p.prodId).then((res: ProductModel) => { // Success
              this.cartData.data.push(new CartDataModel(p.numInCart, res));
              this.cartDataSubject.next({...this.cartData}); // sending a copy of the object
            }
          );
      });
    }
  }

  public addToCart(product: ProductModel, quantity: number = 1): void {

    const productIndex = this.cartCache.data.findIndex((p) => p.prodId === product.id);
    if (productIndex !== -1) { // if already exists
      const prodQuantity = this.cartData.data[productIndex].product.quantity;
      if (quantity > prodQuantity) {
        quantity = prodQuantity;
      }
      this.cartCache.data[productIndex].numInCart = quantity;
      this.cartData.data[productIndex].numInCart = quantity;
      this.saveCartCacheInLocalStorage();
      this.cartDataSubject.next({...this.cartData}); // sending a copy of the object
      return;
    }

    // Refresh product price
    this.productsService.getProduct(product.id).then((res: ProductModel) => {
      this.cartCache.data.push(new CartCacheModel(quantity, product.id));
      this.cartData.data.push(new CartDataModel(quantity, product));
      this.saveCartCacheInLocalStorage();
      this.cartDataSubject.next({...this.cartData}); // sending a copy of the object
    });
  }

  public incrementQuantity(product: ProductModel): void {
    if (this.cartCache != null && this.cartCache.data.length > 0) {
      const productIndex = this.cartCache.data.findIndex((p) => p.prodId === product.id);
      if (productIndex !== -1) {
        const prodQuantity = this.cartData.data[productIndex].product.quantity;
        let incrementedCount = this.cartCache.data[productIndex].numInCart + 1;
        if (incrementedCount > prodQuantity) {
          // TODO: display a toast message
          incrementedCount = prodQuantity;
        }
        this.cartCache.data[productIndex].numInCart = incrementedCount;
        this.cartData.data[productIndex].numInCart = incrementedCount;
        this.saveCartCacheInLocalStorage();
        this.cartDataSubject.next({...this.cartData}); // sending a copy of the object
      }
    }
  }

  public decrementQuantity(product: ProductModel): void {
    if (this.cartCache != null && this.cartCache.data.length > 0) {
      const productIndex = this.cartCache.data.findIndex((p) => p.prodId === product.id);
      if (productIndex !== -1) {
        const decrementedCount = this.cartCache.data[productIndex].numInCart - 1;
        if (decrementedCount < 1) { // removing the product if cart quantity is less then 1
          this.cartCache.data.splice(productIndex, 1);
          this.cartData.data.splice(productIndex, 1);
        } else {
          this.cartCache.data[productIndex].numInCart = decrementedCount;
          this.cartData.data[productIndex].numInCart = decrementedCount;
        }
        this.saveCartCacheInLocalStorage();
        this.cartDataSubject.next({...this.cartData}); // sending a copy of the object
      }
    }
  }

  private saveCartCacheInLocalStorage(): void {
    localStorage.setItem(CART_ITEM_KEY, JSON.stringify(this.cartCache));
  }

  deleteCartProduct(product: ProductModel): boolean {
    const productIndex = this.cartCache.data.findIndex((p) => p.prodId === product.id);
    if (productIndex !== -1) {
      this.cartCache.data.splice(productIndex, 1);
      this.cartData.data.splice(productIndex, 1);
      this.saveCartCacheInLocalStorage();
      this.cartDataSubject.next({...this.cartData}); // sending a copy of the object
      return true;
    }

    return false;
  }

  calculateCartTotal(): number {
    let total = 0;
    for (const cartItem of this.cartData.data) {
      total = total + (cartItem.numInCart * cartItem.product.price);
    }
    return total;
  }

  createOrder(): OrderRequestModel {

    const order = new OrderRequestModel();
    const loggedUser = this.authService.getLoggedInUser();
    if (loggedUser == null) {
      return;
    }

    order.userId = loggedUser.id;
    for (const cartItem of this.cartData.data) {
      const orderDetail: OrderDetailsRequestModel = {
        productId: cartItem.product.id,
        quantity: cartItem.numInCart,
        price: cartItem.product.price
      };
      order.ordersDetails.push(orderDetail);
    }

    return order;
  }

  resetCartData(): void {
    localStorage.removeItem(CART_ITEM_KEY);
    this.cartCache.data = [];
    this.cartData.data = [];
    this.cartDataSubject.next({...this.cartData}); // sending a copy of the object
  }
}
