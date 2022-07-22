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
  public async getAllUserProjects({ }: HttpContextContract) {

    const allProjectByUsers = await User.query().preload('projects')
    return allProjectByUsers
    // const allProjectByUsers = await User.query().preload('projects', (query) => {
    //   query
    // })
    // return allProjectByUsers
  }

  public async me({  params }: HttpContextContract) {
    //TODO return all project from the selected USER

    const user = await User.findNotDeleted(params.id)
    console.log('USER',user?.serialize());
    
    if(user){
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
  public async find({ params, auth, response}: HttpContextContract) {
  
     //TODO return all project from the selected USER

     const user = await User.findNotDeleted(params.id)
     console.log('USER',user?.serialize());
     
     if(user){
       const userProjects = await user.related('projects').query()
       return userProjects
     }
     else{
      return response.badRequest({
              
              message: 'UserProject does not exist'
      })
    }
  

  /*
   * update =  update by id
   * Params: request, response
   */
  //TODO verify the update 
  public async update({ request, params, response }: HttpContextContract) {

    const user = await User.findNotDeleted(request.body().user_id)
    const project = await Project.findNotDeleted(request.body().project_id)

    if (!user&&project) {
      return response.notFound()
    }
   await user
   ?.related('projects')
   .sync(request.body().user_id,request.body().project_id)
   return user

  }



  /*
 * Update user to isDeleted=true
 * Update User /userProject/soft-delete/:id
 */

  public async softDelete({ params, response }: HttpContextContract) {
    const userId = params.userId;
    const projectId = params.projectId;

    const project = await Project.findNotDeleted(projectId);
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
    await user.related('projects').detach([user.id]);
    return response.noContent();
  }




  /*
 * DELETE userProject 
 * DELETE User /userProject/delete/:id
 */
  public async destroy({ params }: HttpContextContract) {


  
   
  }
}
