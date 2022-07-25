import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Planning from 'App/Models/Planning';
import Project from 'App/Models/Project';
import User from 'App/Models/User';
import UserProject from 'App/Models/UserProject';
import CreateUserProjectValidator from 'App/Validators/UsersProjects/CreateUserProjectValidator';
import UpdateUserProjectValidator from 'App/Validators/UsersProjects/UpdateUserProjectValidator'


export default class UserProjectsController {
  /*
   * index = GET ALL
   * Params: no
   */
  public async getAllUserProjects({ }: HttpContextContract) {

    const allProjectByUsers = await User.query().preload('projects')
    return allProjectByUsers
    // const allProjectByUsers = await User.query().preload('projects', (query) => {
    //   query
    // })
    // return allProjectByUsers
  }

  public async me({ params, auth}: HttpContextContract) {
    //TODO return all project from the selected USER

    console.log('USER', auth.user?.id);
    const user = await User.find(auth.user?.id )
    if (user) {
      const userProjects = await user.related('projects').query()
      return userProjects
    }
  }


  public async userConnected({ auth, response }) {
    return response.ok({ user: auth.user })
  }

  /*
 * new =  create a new userProject
 * Params: request, response
 */
  public async new({ response, request }: HttpContextContract) {
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
    return response.json({ message: 'User Project created' });
  }
  /*
    * FIND user by ID
    * Find User /userProject/:id
    */
  public async find({ params, auth, response }: HttpContextContract) {

    //TODO return all project from the selected USER

    const user = await User.findNotDeleted(params.id)
    console.log('USER', user?.serialize());

    if (user) {
      const userProjects = await user.related('projects').query()
      return userProjects
    }
    else {
      return response.badRequest({
        message: 'UserProject does not exist or invalid data input'
      })
    }
  }

  /*
   * update =  update by id
   * Params: request, response
   */
  //TODO verify the update 
  public async update({ request, params, response }: HttpContextContract) {

    const user = await User.findNotDeleted(request.body().user_id)
    const project = await Project.findNotDeleted(request.body().project_id)

    if (!user && project) {
      return response.notFound()
    }
    if(user && project){
      const planning = await Planning.query().preload("userProject")
      const userProject = await User.findNotDeleted(request.body().user_id)
      await userProject?.related('projects')..sync(request.body().project_id)

    }
    //TODO NOT WORKING BECAUSE OF PLANINGS NEED TO BE DONE 

  }

  /*
 * Update user to isDeleted=true
 * Update User /userProject/soft-delete/:id
 */

  public async softDelete({ response, request }: HttpContextContract) {
    // const userProjectPayload = await request.validate(CreateUserProjectValidator)
    const userId = request.body().userId;
    const projectId = request.body().projectId;
    console.log("PROJECTID",projectId);
    const project = await Project.findNotDeleted(projectId);
    console.log("userId",userId);
    const user = await User.findNotDeleted(userId);
    

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
    const userProject = await user
      .related('projects')
      .query()
      .where({
        project_id: projectId,
      })
      .first();

    if (!userProject) {
      return response.notFound();
    }

    // On est assuré que tout existe
    await user.related('projects').sync([user.id]);
    return response.noContent();
  }




  /*
 * DELETE userProject 
 * DELETE User /userProject/delete/:id
 */
  public async destroy({ params }: HttpContextContract) {




  }

  
}
