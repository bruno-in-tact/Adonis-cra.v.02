import { schema, CustomMessages, rules, validator } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateProjectValidator {
  constructor(protected ctx: HttpContextContract) {}
  public reporter = validator.reporters.api;

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({

    title: schema.string({trim: true },),
    key: schema.string([rules.unique({ table: 'projects', column: 'key' })]),
    clientName: schema.string({trim: true },),
    description: schema.string.optional({trim: true },),
    isElligibleTr:schema.boolean.optional(),
    // dayDate: schema.string.optional([rules.escape()]),
    // dayPassed: schema.number.optional( [
    // rules.range(0, 1),
    // ]),
  })


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
     'required': "Le champs '{{field}}' est requis",
  
  };}
