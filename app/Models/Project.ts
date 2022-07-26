import { DateTime } from 'luxon';
import { BaseModel, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm';
import User from './User';

export default class Project extends BaseModel {

  /**
   * Serialize the `$extras` object as it is
   */
    public serializeExtras = true
 

  @column({ isPrimary: true })
  public id: number;

  @column()
  public title: string;

  @column()
  public key: string;
  
  @column()
  public clientName: string;

  @column({
    serialize: (value?: string) => {
      return value ?? null;
    },
  })
  public description?: string;

  @column({
    serialize: (value?: boolean) => {
      return !!value;
    },
  })
  public isElligibleTr: boolean;

  @column({ serializeAs: null })
  public isDeleted?: boolean;

  // @column()
  // public dayDate: string;

  // @column()
  // public dayPassed: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  // @manyToMany(() => User, {
  //   pivotTable: 'user_project',
  //   pivotColumns: ['id'],
  // })
  @manyToMany(() => User, {
    pivotTable: 'user_project',
    pivotColumns: ['day_date'],
  })
  @manyToMany(() => User, {
    pivotTable: 'user_project',
    pivotColumns: ['day_passed'],
  })
  public users: ManyToMany<typeof User>;

  // CUSTOM
  public static findNotDeleted(projectId?: number) {
    return this.query().where({ id: projectId, isDeleted: false }).first();
  }

  public static findAllNotDeleted() {
    return this.query().where('isDeleted', false);
  }


}
