import { ProductModel } from './product-model';

export class CartDataModel {
    constructor(public numInCart: number, public product: ProductModel) {}
}
