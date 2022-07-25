import { DateTime } from 'luxon';
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm';
import UserProject from './UserProject';
import Database from '@ioc:Adonis/Lucid/Database';

export default class Planning extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public dayPassed: number;

  @column()
  public user_project_id: number;

  @column()
  public isDeleted?: boolean;

  @column()
  public dayDate: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => UserProject, )
  public userProject: BelongsTo<typeof UserProject>;
  

  public static findNotDeleted(user_project_id?: number) {
    return this.query().where({ id: user_project_id, isDeleted: false }).first();
  }

  public static findAllNotDeleted() {
    return this.query().where('isDeleted', false);
  }


}
