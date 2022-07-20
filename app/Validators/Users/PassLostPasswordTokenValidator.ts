import { schema, CustomMessages, rules, validator } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PassLostPasswordTokenValidator {
  constructor(protected ctx: HttpContextContract) {}
  public reporter = validator.reporters.api;

  public refs = schema.refs({
    token: this.ctx.request.body().token!,
  });

  public schema = schema.create({
    password: schema.string([rules.minLength(6)]),
    token: schema.string([
      rules.exists({
        table: 'tokens',
        column: 'token',
        where: {
          count: 1,
        },
      }),
    ]),
  });

  public messages: CustomMessages = {
    email: "Le champs '{{field}}' doit être une adresse email valide",
  };
}