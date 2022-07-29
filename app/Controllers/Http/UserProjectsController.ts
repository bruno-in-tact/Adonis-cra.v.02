import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import { test } from '@japa/runner';
import Project from 'App/Models/Project';
import User from 'App/Models/User';
import CreateUserProjectValidator from 'App/Validators/UsersProjects/CreateUserProjectValidator';
import UpdateUserProjectValidator from 'App/Validators/UsersProjects/UpdateUserProjectValidator';



export default class UserProjectsController {

    /*
 * new =  create a new userProject
 * Params: request, response
 */
  public async new({ response, request }: HttpContextContract) {
    const userProjectPayload = await request.validate(CreateUserProjectValidator)
    const user = await User.findNotDeleted(userProjectPayload.userId)
    const project = await Project.findNotDeleted(userProjectPayload.projectId)


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
    // ON créer un objet a user, afin d'ADD dayDate et dayPassed,
    if (userProjectPayload) {
      await project.related('users').attach({
        [user.id]: {
          day_date: userProjectPayload.dayDate,
          day_passed: userProjectPayload.dayPassed,
        }
      })
    }
    // return response.json({ message: 'User Project created' });
    return userProjectPayload
  }

  /*
  * index = GET ALL
  * Params: no
  */

  //todo: on preload les pivotsColumns afin de les ajoutés à l'objet users,  BESOIN DE seriazliszExtras =true dans
   public async getAllUserProjects({ }: HttpContextContract) {
    const users = await User
    .query()
    .preload('projects', (query) => {
      query.pivotColumns(['day_date', 'day_passed'])
    })
     
    return users


    // const allProjectByUsers = await User.query().preload('projects')
    // return allProjectByUsers

  }
  /*
 * ME = get all userProject of connected user
 * Params: auth, 
 *  url/api/usersProjects/index
 */
  public async me({ params, auth }: HttpContextContract) {
    //TODO return all project from the selected USER
    //TODO need to specify the day_date/day_passed latter on

    const user = await User.find(auth.user?.id)
    if (user) {
      const userProjects = await user.related('projects').query()
      return userProjects
    }
  }

  public async userConnected({ auth, response }) {
    return response.ok({ user: auth.user })
  }


  /*
    * FIND user by ID
    * Find User /userProject/:id
    */
  public async find({ params, auth, response }: HttpContextContract) {

    //TODO return all project from the selected USER

    

    // const user = await User.findNotDeleted(params.id)
    // console.log('USER', user?.serialize());

    // if (user) {
    //   const userProjects = await user.related('projects').query()
    //   return userProjects
    // }
    // else {
    //   return response.badRequest({
    //     message: 'UserProject does not exist or invalid data input'
    //   })
    // }

    const project = await Project.findNotDeleted(params.id)
    project?.preload('users')
  }

  /*
   * update =  update by id
   * Params: request, response
   */
  //TODO verify the update 
  public async update({ request, params, response }: HttpContextContract) {

      //TODO UPDATE THE PROJECT USERS by relation of userId && projectID
 
      const userProjectPayload = await request.validate(UpdateUserProjectValidator)
      const projectUserData = await Database.from('user_project').where('id', params.id).first()
      const user = await User.findNotDeleted(userProjectPayload.userId)
      const project = await Project.findNotDeleted(userProjectPayload.projectId)

      //useles right now
      await user?.preload('projects', query => query.pivotColumns(['id']).wherePivot('id', params.id))


      if(!projectUserData){
        return response.notFound()
      }
     if ( !project){
      return response.unprocessableEntity({
        errors: [
          {
            field: 'project_id',
            rule: 'exists',
          },
        ],
      });
    }
    if ( !user){
      return response.unprocessableEntity({
        errors: [
          {
            field: 'user_id',
            rule: 'exists',
          },
        ],
      });
    }
    if( user && project && projectUserData ){
      
      // const deleted = await user
      // .related('projects')
      // .query()
      // .where('isDeleted',false)
      // .where(projectUserData)
      // .delete
      

  
      // await project.merge({ isDeleted: true }).save();

      //TODO sync change all ocurrences, && attach create new one in this case
        await project.related('users').attach({
         [user.id]: {
           day_date: userProjectPayload.dayDate,
           day_passed: userProjectPayload.dayPassed,
         }
       }) 
       
    }

    return userProjectPayload

  }



  /*
 * Update user to isDeleted=true
 * Update User /userProject/soft-delete/:id
 */

  public async softDelete({ response, request }: HttpContextContract) {
    const userProjectPayload = await request.validate(UpdateUserProjectValidator)
    const user = await User.findNotDeleted(userProjectPayload.userId)
    const project = await Project.findNotDeleted(userProjectPayload.projectId)
    


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
        project_id: userProjectPayload.projectId,
      })
      .first();

    if (!userProject) {
      return response.notFound();
    }

    // On est assuré que tout existe
    await user.related('projects').sync([user.id]);
    await user.merge({ isDeleted: true }).save();
    return response.noContent();
  }

  /*
 * DELETE userProject 
 * DELETE User /userProject/delete/:id
 */
  public async destroy({ params }: HttpContextContract) {




  }


}
