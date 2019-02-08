import {repository, Filter} from '@loopback/repository';
import {RestaurantRepository} from '../repositories';
import {param, getFilterSchemaFor, get} from '@loopback/rest';
import {Order} from '../models';

export class RestaurantOrderController {
  constructor(
    @repository(RestaurantRepository)
    protected restaurantRepo: RestaurantRepository,
  ) {}

  @get('restaurants/{restaurantId}/orders')
  async getOrders(
    @param.path.string('restaurantId') restaurantId: number,
    @param.query.object('filter', getFilterSchemaFor(Order)) filter?: Filter,
  ): Promise<Order[]> {
    return await this.restaurantRepo.orders(restaurantId).find(filter);
  }
}
