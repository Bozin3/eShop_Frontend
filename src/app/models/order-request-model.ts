import { OrderDetailsRequestModel } from './order-request-details-model';

export class OrderRequestModel {
    userId: number;
    ordersDetails: OrderDetailsRequestModel[] = [];
}
