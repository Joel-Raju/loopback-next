import {Entity, model, property, hasMany} from '@loopback/repository';
import {Order} from './order.model';

@model()
export class Restaurant extends Entity {
  @property({
    type: 'number',
    id: true,
    required: true,
  })
  ID: number;

  @property({
    type: 'string',
  })
  RestaurantName?: string;

  @hasMany(() => Order, {keyTo: 'Restaurant_ID'})
  orders: Order[];

  constructor(data?: Partial<Restaurant>) {
    super(data);
  }
}
