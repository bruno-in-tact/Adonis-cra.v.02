import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Project from 'App/Models/Project'
import CreateProjectValidator from 'App/Validators/Projects/CreateProjectValidator'
import UpdateProjectValidator from 'App/Validators/Projects/UpdateProjectValidator'

export default class ProjectController {
  
  /*
   * getAllProjectsEvenDeleted = GET ALL
   * Params: no
   */
  public async getAllProjectsEvenDeleted({ }: HttpContextContract) {
    const projects = await Project.all()
    return projects

  }

   /*
 * allNotDeleted =  find all users not soft deleted
 * Params: none
 *  GET : users/get
 */
   public async getAllNotDeleted({ }: HttpContextContract) {
    const allNotDeleted = await Project.findAllNotDeleted()
    return allNotDeleted
  }

  /*
 * new =  create a new userx
 * Params: request, response
 */
  public async new({ request }: HttpContextContract) {
    const projectPayLoad = await request.validate(CreateProjectValidator)
    const project = await Project.create(projectPayLoad)
    console.log(projectPayLoad)

    return  project

  }

  /*
    * FIND project by ID
    * Find project /users/:id
    */
  public async find({ params, response }: HttpContextContract) {
    const project = await Project.findNotDeleted(params.id);
    if (!project){
      return response.notFound({message: 'Project not found '})
    }
    return project
  }
  /*
   * update =  update by id
   * Params: request, response
   */
  public async update({ request, params,response }: HttpContextContract) {
    const project = await Project.findNotDeleted(params.id)
    if (!project){
      return response.notFound({message: 'Project not found '})
    }
    const projectPayload = await request.validate(UpdateProjectValidator);
    await project.merge(projectPayload).save()
    await project.refresh

    return project

  }
  /*
 * Update project to isDeleted=true
 * Update Project /project/soft-delete/:id
 */

  public async softDelete({ params,response }: HttpContextContract) {
    const project = await Project.findNotDeleted(params.id)
    if (!project){
      return response.notFound({message: 'Project not found '})
    }
    await project.merge({ isDeleted: true }).save();


    return project
  }



  /*
 * DELETE project 
 * DELETE project /project/delete/:id
 */
  public async destroy({ params }: HttpContextContract) {
    const project = await Project.findOrFail(params.id)
    await project.delete()

    return project
  }
}
