import { OrderDetailsResponseModel } from './order-details-response-model';

export interface OrderResponseModel {
    id: number;
    userId: number;
    ordersDetails: OrderDetailsResponseModel[];
}
