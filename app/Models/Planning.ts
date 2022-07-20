import { DateTime } from 'luxon';
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm';
import UserProject from './UserProject';

export default class Planning extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public dayPassed: number;
  @column()
  public daydate: DateTime;

  @column()
  public userProjectId: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => UserProject)
  public userProject: BelongsTo<typeof UserProject>;

  public static findNotDeleted(projectId?: number) {
    return this.query().where({ id: projectId, isDeleted: false }).first();
  }

  public static findAllNotDeleted() {
    return this.query().where('isDeleted', false);
  }
}
