import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Restaurant} from '../models';
import {RestaurantRepository} from '../repositories';

export class RestaurantController {
  constructor(
    @repository(RestaurantRepository)
    public restaurantRepository: RestaurantRepository,
  ) {}

  @post('/restaurants', {
    responses: {
      '200': {
        description: 'Restaurant model instance',
        content: {'application/json': {schema: {'x-ts-type': Restaurant}}},
      },
    },
  })
  async create(@requestBody() restaurant: Restaurant): Promise<Restaurant> {
    return await this.restaurantRepository.create(restaurant);
  }

  @get('/restaurants/count', {
    responses: {
      '200': {
        description: 'Restaurant model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Restaurant)) where?: Where,
  ): Promise<Count> {
    return await this.restaurantRepository.count(where);
  }

  @get('/restaurants', {
    responses: {
      '200': {
        description: 'Array of Restaurant model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Restaurant}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Restaurant))
    filter?: Filter,
  ): Promise<Restaurant[]> {
    return await this.restaurantRepository.find(filter);
  }

  @patch('/restaurants', {
    responses: {
      '200': {
        description: 'Restaurant PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() restaurant: Restaurant,
    @param.query.object('where', getWhereSchemaFor(Restaurant)) where?: Where,
  ): Promise<Count> {
    return await this.restaurantRepository.updateAll(restaurant, where);
  }

  @get('/restaurants/{id}', {
    responses: {
      '200': {
        description: 'Restaurant model instance',
        content: {'application/json': {schema: {'x-ts-type': Restaurant}}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Restaurant> {
    return await this.restaurantRepository.findById(id);
  }

  @patch('/restaurants/{id}', {
    responses: {
      '204': {
        description: 'Restaurant PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() restaurant: Restaurant,
  ): Promise<void> {
    await this.restaurantRepository.updateById(id, restaurant);
  }

  @put('/restaurants/{id}', {
    responses: {
      '204': {
        description: 'Restaurant PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() restaurant: Restaurant,
  ): Promise<void> {
    await this.restaurantRepository.replaceById(id, restaurant);
  }

  @del('/restaurants/{id}', {
    responses: {
      '204': {
        description: 'Restaurant DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.restaurantRepository.deleteById(id);
  }
}
