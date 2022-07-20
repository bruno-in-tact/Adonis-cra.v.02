import { schema, CustomMessages, rules, validator } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class PassLostUserValidator {
  constructor(protected ctx: HttpContextContract) { }

  public reporter = validator.reporters.api;


  public schema = schema.create({
    email: schema.string.optional([
      rules.email(),
      rules.normalizeEmail({
        allLowercase: true,
        gmailRemoveDots: false,
      }),
      rules.required(),
    ]),
  });

  public messages: CustomMessages = {
    email: "Le champs '{{field}}' doit être une adresse email valide",
  };
}