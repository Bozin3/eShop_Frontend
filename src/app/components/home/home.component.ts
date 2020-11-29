import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductModel } from 'src/app/models/product-model';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  products: ProductModel[] = [];
  page = 1;
  productLimit = 10;

  constructor(private productService: ProductService,
              private cartService: CartService,
              private router: Router,
              private toast: ToastrService) { }

  ngOnInit(): void {
    this.getProducts();
  }

  selectProduct(id: number): void {
    this.router.navigate(['/product/' + id]);
  }

  getProducts(): void {
    this.productService.getProducts(this.page, this.productLimit).subscribe((products) => {
      this.products = products;
      console.log(this.products);
    });
  }

  saveCartProduct(product: ProductModel): void {
    this.cartService.addToCart(product);
    this.toast.success(`${product.title} added to the cart.`, 'Product Added', {
      timeOut: 1000,
      progressBar: false,
      progressAnimation: 'increasing',
      positionClass: 'toast-top-right'
    });
  }

  incrementPage(): void {
    this.page++;
    this.getProducts();
  }

  decrementPage(): void {
    this.page--;
    if (this.page < 1) {
      this.page = 1;
    }
    this.getProducts();
  }
}
