import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
  similarProducts: ProductModel[] = [];
  thumbImages: string[] = [];

  @ViewChild('quantity') quantity;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private toast: ToastrService) {
  }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId != null && productId !== undefined) {
      this.productService.getProduct(+productId).then((product) => {
        this.product = product;
        if (product.images != null && product.images !== '') {
          this.thumbImages = product.images.split(';');
        }
        this.getSimilarProducts(this.product.catId);
        console.log(this.product);
        console.log(this.thumbImages);
      }).catch((err) => console.log(err));
    }
  }

  getSimilarProducts(categoryId: number): void {
    this.productService.getProductsByCategory(categoryId, 1, 4).subscribe((products) => {
      this.similarProducts = products;
      console.log(products);
    });
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

  addToCart(product: ProductModel): void {
    const insertedQuantity = this.quantity.nativeElement.value;
    if (insertedQuantity > 0) {
      this.cartService.addToCart(product, +insertedQuantity);
      this.toast.success(`${product.title} added to the cart.`, 'Product Added', {
        timeOut: 1000,
        progressBar: false,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right'
      });
    }
  }

}
