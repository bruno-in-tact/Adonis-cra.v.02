import { DateTime } from 'luxon';
import { BaseModel, beforeSave, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm';
import Hash from '@ioc:Adonis/Core/Hash';
import Project from './Project';

export default class User extends BaseModel {

  // /**
  //  * Serialize the `$extras` object as it is
  //  */
  public serializeExtras = true
  

  

  @column({ isPrimary: true })
  public id: number;

  @column()
  public email: string;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public firstName: string;

  @column()
  public lastName: string;

  @column()
  public country: string;

  @column()
  public town: string;

  @column()
  public startDate: string;

  @column({
    serialize: (value?: Number) => {
      return !!value; 
    },
  })
  public isAdmin: boolean;

  @column({ serializeAs: null })
  public isDeleted: boolean;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime;

  public static findNotDeleted(userId?: number) {
    return this.query().where({ id: userId, isDeleted: false }).first();
  }

  public static findNotDeletedByEmail(email: string) {
    return this.query().where({ email, isDeleted: false }).first();
  }

  public static findAllNotDeleted() {
    return this.query().where('isDeleted', false);
  }



  @manyToMany(() => Project, {
     pivotTable: 'user_project',
  })

  @manyToMany(() => Project, {
    pivotTable: 'user_project',
    pivotColumns: ['day_date'],
  })
  @manyToMany(() => Project, {
    pivotTable: 'user_project',
    pivotColumns: ['day_passed'],
  })
  public projects: ManyToMany<typeof Project>;



  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }
}
