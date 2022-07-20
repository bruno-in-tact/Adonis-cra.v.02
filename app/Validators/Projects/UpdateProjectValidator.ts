import { schema, CustomMessages, rules, validator } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateProjectValidator {
  constructor(protected ctx: HttpContextContract) {}
 
  public reporter = validator.reporters.api;

  public refs = schema.refs({
    projectId: this.ctx.params.projectId!,
  });

  public schema = schema.create({
    title: schema.string.optional(),
    key: schema.string.optional([
      rules.unique({
        table: 'projects',
        column: 'key',
        whereNot: { id: this.refs.projectId, is_deleted: true },
      }),
    ]),
    description: schema.string.optional(),
    clientName: schema.string.optional(),
    is_elligible_tr: schema.boolean.optional(),
  });

  public messages: CustomMessages = {
    required: "Le champs '{{field}}' est requis",
  };
}