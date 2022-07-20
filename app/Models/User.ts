import { DateTime } from 'luxon'
import { BaseModel, column, beforeSave, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Logger from '@ioc:Adonis/Core/Logger'
import Project from './Project'


export default class User extends BaseModel {
  static withTrashed() {
    throw new Error('Method not implemented.')
  }
  @column({ isPrimary: true })
  public id: number

  @column()
  public firstName: string

  // @column()
  // public uid?: number

  @column()
  public lastName: string

  @column({
    serialize: (value?: Number) => {
      return !!value;
    },
  })  public isAdmin: boolean

  @column({ serializeAs: null })
  public password: string

  @column()
  public email: string;

  @column({ serializeAs: null })
  public rememberMeToken?: string;

  @column()
  public town?: string

  @column()
  public country?: string

  @column()
  public isDeleted?: boolean

  @column()
  public startDate?: DateTime

  @column()
  public endDate?: DateTime

  @column.dateTime({ columnName: 'deletedAt' })
  public deletedAt?: DateTime | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // à vérifier
  @manyToMany(() => Project)
  public projects: manyToMany<typeof Project>;


  // function 
  public static findNotDeleted(id?: number) {
    return this.query().where({ id, isDeleted: false }).first();
  }
  public static findAllNotDeleted() {
    return this.query().where({ isDeleted: false });
  }
  public static findNotDeletedByEmail(email: string) {
    return this.query().where({ email, isDeleted: false }).first();
  }

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      try {
        user.password = await Hash.make(user.password)
      }
      catch (error) {
        Logger.error(error)
      }
    }
  }

}
