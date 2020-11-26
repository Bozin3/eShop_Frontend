import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductModel } from 'src/app/models/product-model';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  product: ProductModel;
  thumbImages: string[] = [];

  @ViewChild('quantity') quantity;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId != null && productId !== undefined) {
      this.productService.getProduct(+productId).then((product) => {
        this.product = product;
        if (product.images != null && product.images !== '') {
          this.thumbImages = product.images.split(';');
        }
        console.log(this.product);
        console.log(this.thumbImages);
      }).catch((err) => console.log(err));
    }
  }

  increment(): void {
    let currentQuantity = this.quantity.nativeElement.value;
    currentQuantity ++;
    if (currentQuantity > this.product.quantity) {
      currentQuantity = this.product.quantity;
    }
    this.quantity.nativeElement.value = currentQuantity;
  }

  decrement(): void {
    let currentQuantity = this.quantity.nativeElement.value;
    currentQuantity --;
    if (currentQuantity < 1) {
      currentQuantity = 1;
    }
    this.quantity.nativeElement.value = currentQuantity;
  }

  addToCart(): void {
    const insertedQuantity = this.quantity.nativeElement.value;
    if (insertedQuantity > 0) {
      this.cartService.addToCart(this.product, +insertedQuantity);
      this.router.navigate(['/']);
    }
  }

}
