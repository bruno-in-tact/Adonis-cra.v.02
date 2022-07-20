import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Project from 'App/Models/Project';
import User from 'App/Models/User';
import UserProject from 'App/Models/UserProject';
import UpdateUserProjectValidator from 'App/Validators/UsersProjects/UpdateUserProjectValidator'


export default class UserProjectsController {
  /*
   * index = GET ALL
   * Params: no
   */
  public async getAllEvenDeleted({}: HttpContextContract) {
    const usersProjects = await UserProject.all()
    console.log('usersProjects',usersProjects);
  
    return usersProjects
    }

  /*
* allNotDeleted =  find all usersProject not soft deleted
* Params: none
*  GET : userProject/get
*/
  public async getAllNotDeleted({ auth}: HttpContextContract) {
    const sessionUser = auth.use('web').user!;
    const allNotDeleted = await UserProject.findAllNotDeleted()
    if (sessionUser){
      return allNotDeleted
    }
  }
  /*
 * new =  create a new userProject
 * Params: request, response
 */
  public async new({  response, request}: HttpContextContract) {
    const user = await User.findNotDeleted(request.body().user_id)
    const project = await Project.findNotDeleted(request.body().project_id)


    if (!project) {
      return response.unprocessableEntity({
        errors: [
          {
            field: 'projectId',
            rule: 'exists',
          },
        ],
      });
    }
    if (!user) {
      return response.unprocessableEntity({
        errors: [
          {
            field: 'user',
            rule: 'exists',
          },
        ],
      });
    }

    // On est assuré que tout existe
    // On créé la liaison
    await project.related('users').attach([user.id]);

    
    return response.created();

  }


  /**
    * FIND user by ID
    * Find User /userProject/:id
    */
  public async find({ params }: HttpContextContract) {
    const userProject = await UserProject.findNotDeleted(params.id);
    return userProject
  }
  /*
   * update =  update by id
   * Params: request, response
   */
  public async update({ request, params, response }: HttpContextContract) {

    const userProject = await UserProject.findNotDeleted(params.id)
    userProject?.merge(await request.validate(UpdateUserProjectValidator))

    const user = await User.findNotDeleted(request.body().user_id)
    const project = await Project.findNotDeleted(request.body().project_id)
    if(!userProject){
      return response.status(404)
    }
    if (project && user) {
      userProject.save()
    } else if (!project) {
      return response.unprocessableEntity({
        errors: [
          {
            field: 'project_id',
            rule: 'exists',
          },
        ],
      });
    } else if (!user) {
      return response.unprocessableEntity({
        errors: [
          {
            field: 'user_id',
            rule: 'exists',
          },
        ],
      });
      console.log('ERROR');
      // throw new MyError();
    }
    return userProject


  }
  /**
 * Update user to isDeleted=true
 * Update User /userProject/soft-delete/:id
 */

  public async softDelete({ params }: HttpContextContract) {
    const userProject = await UserProject.findOrFail(params.id)
    userProject.$isDeleted = true
    await userProject.save()

    return userProject
  }


  /**
 * DELETE userProject 
 * DELETE User /userProject/delete/:id
 */
  public async destroy({ params }: HttpContextContract) {
    const userProject = await UserProject.findOrFail(params.id)
    await userProject.delete()

    return userProject
  }
}
