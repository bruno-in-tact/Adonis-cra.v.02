import { schema, CustomMessages, rules, validator } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'


export default class CreateUserValidator {
  constructor(protected ctx: HttpContextContract) { }

  public reporter = validator.reporters.api;

  public schema = schema.create({

    // user: schema.object().members({

      firstName: schema.string({ trim: true }, [rules.escape()]),
      lastName: schema.string({ trim: true }, [rules.escape()]),
      email: schema.string({ trim: true }, [rules.email(), rules.escape(),
      rules.normalizeEmail({
        allLowercase: true,
        gmailRemoveDots: false,
      }),
      rules.unique({
        table: 'users', column: 'email', caseInsensitive: true,
        where: { is_deleted: false },
      })]),

      password: schema.string([rules.minLength(6), rules.escape()],),
      startDate: schema.string([rules.escape()]),
      town: schema.string.optional({ trim: true }, [rules.escape()]),
      country: schema.string.optional({ trim: true }, [rules.escape()]),
      isDdmin: schema.boolean.optional([rules.escape()]),

    })
  // })



  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */


  public messages: CustomMessages = {
    'required': "The field '{{field}}' is required",
    'email': "The field '{{field}}'  and with a correct format",
    'email.unique': "this email adresse is already in use",
    'rule': "the field {{field}} only accept letters",
    'password.minLength': "The field '{{field}}' must have atleast 6 character ",
  };
}