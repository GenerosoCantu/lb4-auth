import { DefaultCrudRepository } from '@loopback/repository';
import { Photo, PhotoRelations } from '../models';
import { JoornaloDbDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class PhotoRepository extends DefaultCrudRepository<
  Photo,
  typeof Photo.prototype.id,
  PhotoRelations
  > {
  constructor(
    @inject('datasources.joornaloDB') dataSource: JoornaloDbDataSource,
  ) {
    super(Photo, dataSource);
  }
}
