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
import {News} from '../models';
import {NewsRepository} from '../repositories';

export class NewsController {
  constructor(
    @repository(NewsRepository)
    public newsRepository : NewsRepository,
  ) {}

  @post('/news', {
    responses: {
      '200': {
        description: 'News model instance',
        content: {'application/json': {schema: getModelSchemaRef(News)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(News, {
            title: 'NewNews',
            
          }),
        },
      },
    })
    news: News,
  ): Promise<News> {
    return this.newsRepository.create(news);
  }

  @get('/news/count', {
    responses: {
      '200': {
        description: 'News model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(News)) where?: Where<News>,
  ): Promise<Count> {
    return this.newsRepository.count(where);
  }

  @get('/news', {
    responses: {
      '200': {
        description: 'Array of News model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(News)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(News)) filter?: Filter<News>,
  ): Promise<News[]> {
    return this.newsRepository.find(filter);
  }

  @patch('/news', {
    responses: {
      '200': {
        description: 'News PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(News, {partial: true}),
        },
      },
    })
    news: News,
    @param.query.object('where', getWhereSchemaFor(News)) where?: Where<News>,
  ): Promise<Count> {
    return this.newsRepository.updateAll(news, where);
  }

  @get('/news/{id}', {
    responses: {
      '200': {
        description: 'News model instance',
        content: {'application/json': {schema: getModelSchemaRef(News)}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<News> {
    return this.newsRepository.findById(id);
  }

  @patch('/news/{id}', {
    responses: {
      '204': {
        description: 'News PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(News, {partial: true}),
        },
      },
    })
    news: News,
  ): Promise<void> {
    await this.newsRepository.updateById(id, news);
  }

  @put('/news/{id}', {
    responses: {
      '204': {
        description: 'News PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() news: News,
  ): Promise<void> {
    await this.newsRepository.replaceById(id, news);
  }

  @del('/news/{id}', {
    responses: {
      '204': {
        description: 'News DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.newsRepository.deleteById(id);
  }
}
