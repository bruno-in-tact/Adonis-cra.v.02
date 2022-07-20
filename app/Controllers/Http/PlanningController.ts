import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Planning from 'App/Models/Planning'
import UpdatePlanningValidator from 'App/Validators/Plannings/UpdatePlanningValidator'
import CreatePlanningValidator from 'App/Validators/Plannings/CreatePlanningValidator'
import UserProjects from 'App/Models/UserProject'

export default class PlanningsController {

  /*
   * index = GET ALL
   * Params: no
   */
  public async index({ }: HttpContextContract) {
    const plannings = await Planning.all()
    return plannings

  }

  /*
* allNotDeleted =  find all users not soft deleted
* Params: none
*  GET : users/get
*/
  public async getAllNotDeleted({ }: HttpContextContract) {
    const allNotDeleted = await Planning.findAllNotDeleted()
    return allNotDeleted
  }

  /*
 * new =  create a new planning
 * Params: request, response
 */
  public async new({ request, response }: HttpContextContract) {
    const planingPayLoad = await request.validate(CreatePlanningValidator)
    const userProject = await UserProjects.findNotDeleted(request.body().user_project_id)
    if (!userProject) {
      return response.unprocessableEntity({
        errors: [
          {
            field: 'user_project_id',
            rule: 'exists',
          },
        ],
      });
    }else{
      const planning = await Planning.create(planingPayLoad)
      console.log(planingPayLoad)
      return planning
    }
    
  }

  /**
    * FIND planning by ID
    * Find Planning /users/:id
    */
  public async find({ params }: HttpContextContract) {

    const planning = await Planning.findNotDeleted(params.id);
    return planning
  }
  /*
   * update =  update by id
   * Params: request, response
   */
  public async update({ request, params, response }: HttpContextContract) {
    const planning = await Planning.findOrFail(params.id)
    const userProject = await UserProjects.findNotDeleted(request.body().user_project_id)
    planning?.merge(await request.validate(UpdatePlanningValidator))

    if (!userProject) {
      return response.unprocessableEntity({
        errors: [
          {
            field: 'user_project_id',
            rule: 'exists',
          },
        ],
      });
    }
    else {

      planning.save()
    }
    return planning

  }



  //   /*
  //  * update =  update by id
  //  * Params: request, response
  //  */
  //   public async update({ request, params,response }: HttpContextContract) {

  //     const planning = await Planning.findNotDeleted(params.id)
  //     planning?.merge(await request.validate(UpdatePlanningValidator))
  //     const userProject = await UserProjects.findNotDeleted(request.body().user_project_id)
  //     if(!planning){
  //       return response.status(404)
  //     }
  //      if (userProject) {
  //       planning.save()
  //     } else if (!userProject) {
  //       return response.unprocessableEntity({
  //         errors: [
  //           {
  //             field: 'user_project_id',
  //             rule: 'exists',
  //           },
  //         ],
  //       });
  //     }
  //     return userProject
  //   }
  /**
 * Update planning to isDeleted=true
 * Update Planning /users/soft-delete/:id
 */

  public async softDelete({ params }: HttpContextContract) {
    const planning = await Planning.findOrFail(params.id)
    planning.isDeleted = true
    await planning.save()

    return planning
  }



  /**
 * DELETE planning 
 * DELETE Planning /users/delete/:id
 */
  public async destroy({ params }: HttpContextContract) {
    const planning = await Planning.findOrFail(params.id)
    await planning.delete()

    return planning
  }
}
