import { ProductModel } from './product-model';

export interface OrderDetailsResponseModel {
    quantity: number;
    price: number; // product ordered price
    product: ProductModel;
}
