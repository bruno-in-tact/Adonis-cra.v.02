import { DateTime } from 'luxon';
import { BaseModel, beforeCreate, beforeSave, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm';
import crypto from 'crypto';
import User from './User';
import { TokenTypes } from 'App/Contracts/enums';

export default class Token extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public token: string;

  @column.dateTime()
  public validity_date: DateTime;

  @column()
  public count: number;

  @column()
  public userId?: number;

  @column()
  public type?: TokenTypes;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime;

  // -------------------
  // SPECIFIC FUNCTIONS
  // -------------------

  public static async createSingleToken(type: TokenTypes, userId?: number) {
    const token = await this.query().where({ user_id: userId, type }).first();
    if (token && this.isValid(token)) {
      // Un token est toujours valide, je le retourne
      return token;
    }
    let validityDate = DateTime.now().plus({ days: 1 });
    let count = 1;

    switch (type) {
      case TokenTypes.PASSLOST:
        validityDate = DateTime.now().plus({ minutes: 30 });
        break;
      default:
        break;
    }

    return this.create({ type, userId: userId, validity_date: validityDate, count });
  }

  public static isValid(token: Token) {
    const now = DateTime.now();
    return token.count > 0 && token.validity_date > now;
  }

  @hasOne(() => User)
  public user: HasOne<typeof User>;

  @beforeCreate()
  public static async generateToken(token: Token) {
    token.token = crypto.randomBytes(64).toString('hex');
  }
}
