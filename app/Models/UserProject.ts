import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm';
import Project from './Project';
import User from './User';

export default class UserProject extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public project_id: number;

  @column()
  public user_id: number;

  @column({ serializeAs: null })
  public isDeleted?: boolean;


  @hasMany(() => Project)
  public projects: HasMany<typeof Project>;

  @hasMany(() => User)
  public users: HasMany<typeof User>;

  public static findNotDeleted(projectId?: number) {
    return this.query().where({ id: projectId, isDeleted: false }).first();
  }


  public static findAllNotDeleted() {
    return this.query().where('isDeleted', false);
  }
}
