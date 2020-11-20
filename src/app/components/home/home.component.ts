import { Component, OnInit } from '@angular/core';
import { ProductModel } from 'src/app/models/product-model';
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

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.productService.getProducts(this.page, this.productLimit).subscribe((products) => {
      this.products = products;
      console.log(this.products);
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
