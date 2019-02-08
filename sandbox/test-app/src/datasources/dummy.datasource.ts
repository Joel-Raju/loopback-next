import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as config from './dummy.datasource.json';

export class DummyDataSource extends juggler.DataSource {
  static dataSourceName = 'dummy';

  constructor(
    @inject('datasources.config.dummy', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
