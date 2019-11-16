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
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Photo} from '../models';
import {PhotoRepository} from '../repositories';

export class PhotoController {
  constructor(
    @repository(PhotoRepository)
    public photoRepository : PhotoRepository,
  ) {}

  @post('/photos', {
    responses: {
      '200': {
        description: 'Photo model instance',
        content: {'application/json': {schema: getModelSchemaRef(Photo)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Photo, {
            title: 'NewPhoto',
            
          }),
        },
      },
    })
    photo: Photo,
  ): Promise<Photo> {
    return this.photoRepository.create(photo);
  }

  @get('/photos/count', {
    responses: {
      '200': {
        description: 'Photo model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Photo)) where?: Where<Photo>,
  ): Promise<Count> {
    return this.photoRepository.count(where);
  }

  @get('/photos', {
    responses: {
      '200': {
        description: 'Array of Photo model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Photo)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Photo)) filter?: Filter<Photo>,
  ): Promise<Photo[]> {
    return this.photoRepository.find(filter);
  }

  @patch('/photos', {
    responses: {
      '200': {
        description: 'Photo PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Photo, {partial: true}),
        },
      },
    })
    photo: Photo,
    @param.query.object('where', getWhereSchemaFor(Photo)) where?: Where<Photo>,
  ): Promise<Count> {
    return this.photoRepository.updateAll(photo, where);
  }

  @get('/photos/{id}', {
    responses: {
      '200': {
        description: 'Photo model instance',
        content: {'application/json': {schema: getModelSchemaRef(Photo)}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Photo> {
    return this.photoRepository.findById(id);
  }

  @patch('/photos/{id}', {
    responses: {
      '204': {
        description: 'Photo PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Photo, {partial: true}),
        },
      },
    })
    photo: Photo,
  ): Promise<void> {
    await this.photoRepository.updateById(id, photo);
  }

  @put('/photos/{id}', {
    responses: {
      '204': {
        description: 'Photo PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() photo: Photo,
  ): Promise<void> {
    await this.photoRepository.replaceById(id, photo);
  }

  @del('/photos/{id}', {
    responses: {
      '204': {
        description: 'Photo DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.photoRepository.deleteById(id);
  }
}
