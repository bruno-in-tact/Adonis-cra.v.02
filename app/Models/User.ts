import { DateTime } from 'luxon';
import { BaseModel, beforeSave, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm';
import Hash from '@ioc:Adonis/Core/Hash';
import Project from './Project';
import { Response } from '@adonisjs/core/build/standalone';

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public email: string;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public first_name: string;

  @column()
  public last_name: string;

  @column()
  public country: string;

  @column()
  public town: string;

  @column()
  public start_date: DateTime;

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
  public projects: ManyToMany<typeof Project>;



  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }
}
