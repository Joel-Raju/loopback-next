import {Model, model, property, Entity} from '@loopback/repository';

@model()
export class Order extends Entity {
  @property({
    type: 'number',
    id: true,
    required: true,
  })
  ID: number;

  @property({
    type: 'number',
  })
  Total?: number;

  @property({
    type: 'number',
    required: true,
  })
  Restaurant_ID: number;

  constructor(data?: Partial<Order>) {
    super(data);
  }
}
