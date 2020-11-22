import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartCache } from '../models/cart-cache';
import { CartCacheModel } from '../models/cart-cache-model';
import { CartData } from '../models/cart-data';
import { CartDataModel } from '../models/cart_data_model';
import { ProductModel } from '../models/product-model';
import { ProductService } from './product.service';

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

  constructor(private productsService: ProductService) {
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

  public saveCartCache(product: ProductModel): void {
    // Refresh product price
    this.productsService.getProduct(product.id).then((res: ProductModel) => {
      this.cartCache.data.push(new CartCacheModel(1, product.id));
      this.cartData.data.push(new CartDataModel(1, product));
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
        const incrementedCount = this.cartCache.data[productIndex].numInCart - 1;
        if (incrementedCount < 1) { // removing the product if cart quantity is less then 1
          this.cartCache.data.splice(productIndex);
          this.cartData.data.splice(productIndex);
        } else {
          this.cartCache.data[productIndex].numInCart = incrementedCount;
          this.cartData.data[productIndex].numInCart = incrementedCount;
        }
        this.saveCartCacheInLocalStorage();
        this.cartDataSubject.next({...this.cartData}); // sending a copy of the object
      }
    }
  }

  private saveCartCacheInLocalStorage(): void {
    localStorage.setItem(CART_ITEM_KEY, JSON.stringify(this.cartCache));
  }

  deleteCartProduct(product: ProductModel): void {
    const productIndex = this.cartCache.data.findIndex((p) => p.prodId === product.id);
    if (productIndex !== -1) {
      this.cartCache.data.splice(productIndex);
      this.cartData.data.splice(productIndex);
      this.saveCartCacheInLocalStorage();
      this.cartDataSubject.next({...this.cartData}); // sending a copy of the object
    }
  }

  calculateCartTotal(): number {
    let total = 0;
    for (const cartItem of this.cartData.data) {
      total = total + (cartItem.numInCart * cartItem.product.price);
    }
    return total;
  }

  private resetCartData(): void {
    this.cartCache = new CartCache();
    this.cartData = new CartData();
  }
}
