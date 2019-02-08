import {
  DefaultCrudRepository,
  juggler,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {Restaurant, Order} from '../models';
import {DummyDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {OrderRepository} from './order.repository';

export class RestaurantRepository extends DefaultCrudRepository<
  Restaurant,
  typeof Restaurant.prototype.ID
> {
  public readonly orders: HasManyRepositoryFactory<
    Order,
    typeof Restaurant.prototype.ID
  >;

  constructor(
    @inject('datasources.dummy') dataSource: DummyDataSource,
    @repository.getter('OrderRepository')
    getOrderRepository: Getter<OrderRepository>,
  ) {
    super(Restaurant, dataSource);

    this.orders = this.createHasManyRepositoryFactoryFor(
      'orders',
      getOrderRepository,
    );
  }
}
