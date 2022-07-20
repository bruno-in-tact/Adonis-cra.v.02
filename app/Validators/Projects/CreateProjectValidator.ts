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

    projectName: schema.string({trim: true },[rules.regex(/^[a-zA-Z]+$/),]),
    projectKey: schema.string([rules.unique({ table: 'projects', column: 'project_key' })]),
    clientName: schema.string({trim: true },),
    projectDetails: schema.string.optional({trim: true },),
    restaurantTicket:schema.boolean.optional(),

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
