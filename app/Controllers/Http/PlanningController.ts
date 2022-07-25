import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UpdatePlanningValidator from 'App/Validators/Plannings/UpdatePlanningValidator'
import CreatePlanningValidator from 'App/Validators/Plannings/CreatePlanningValidator'
import Planning from 'App/Models/Planning'
import User from 'App/Models/User'

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
  // public async new({ request, response }: HttpContextContract) {
  //   const planingPayLoad = await request.validate(CreatePlanningValidator)
  //   console.log(request.body());

  //   const userProject = await UserProject.find(request.body().user_project_id)
  //   if (!userProject) {
  //     return response.unprocessableEntity({
  //       errors: [
  //         {
  //           field: 'user_project_id',
  //           rule: 'exists',
  //         },
  //       ],
  //     });
  //   }else{
  //     const planning = await Planning.create(planingPayLoad)
  //     console.log(planingPayLoad)
  //     return planning
  //   }

  // }

  public async new({ request, response }: HttpContextContract) {
    const planingPayLoad = await request.validate(CreatePlanningValidator)
    const userId = (request.body().user_project_id)
    const user = await User.findNotDeleted(userId);
    if (user ) {

      const planning = await Planning.create(planingPayLoad)
      return planning
    } else {
      return response.unprocessableEntity({
        errors: [
          {
            field: 'user_project',
            rule: 'exists',
          },
        ],
      });
    }
  }

  /*
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

    public async update({ request, params,response }: HttpContextContract) {

      const planning = await Planning.findNotDeleted(params.id)
      planning?.merge(await request.validate(UpdatePlanningValidator))
      const userId = (request.body().user_project_id)
        const user = await User.findNotDeleted(userId); 
       if(!planning){
        return response.status(404)
      }
       if (user) {
        planning.save()
      } else if (!user) {
        return response.unprocessableEntity({
          errors: [
            {
              field: 'user_project_id',
              rule: 'exists',
            },
          ],
        });
      }
      return planning
    }
  /**
 * Update planning to isDeleted=true
 * Update Planning /users/soft-delete/:id
 */

  public async softDelete({ params }: HttpContextContract) {
    const planning = await Planning.findOrFail(params.id)
    planning.$isDeleted = true
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
  
  // public async isElegibleToRestaurantTicket({ params }: HttpContextContract) {
  //   const user = await User.find(params.id)

  //   const userProjects =  await user?.related('projects').query().preload('plannings')

  //   return userProjects
    
  //  }
}
