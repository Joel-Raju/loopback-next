import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {Order} from '../models';
import {DummyDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class OrderRepository extends DefaultCrudRepository<
  Order,
  typeof Order.prototype.ID
> {
  constructor(
    @inject('datasources.dummy') dataSource: DummyDataSource,
  ) {
    super(Order, dataSource);
  }
}
