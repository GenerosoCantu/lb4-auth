import { Entity, model, property } from '@loopback/repository';
import { v4 as uuid } from 'uuid';

@model()
export class Photo extends Entity {
  @property({
    type: 'string',
    id: true,
    default: () => uuid(),
  })
  id?: string;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
  })
  desc?: string;

  @property({
    type: 'string',
    required: true,
  })
  image: string;


  constructor(data?: Partial<Photo>) {
    super(data);
  }
}

export interface PhotoRelations {
  // describe navigational properties here
}

export type PhotoWithRelations = Photo & PhotoRelations;
