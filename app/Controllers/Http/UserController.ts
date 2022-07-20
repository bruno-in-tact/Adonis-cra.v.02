import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import CreateUserValidator from 'App/Validators/Users/CreateUserValidator'
import UpdateUserValidator from 'App/Validators/Users/UpdateUserValidator'


export default class UserController {

  /*
* ME =  return auth user
* Params: none
* GET : users/me
*/
  public async me({ auth, response }) {
    return response.ok({ user: auth.user })
  }

  /*
* userNotDeleted =  find all users even deleted
* Params: none
*  GET : users/index
*/
  public async index({ }: HttpContextContract) {
    const users = await User.all()
    return users
    
  }

  /*
 * allNotDeleted =  find all users not soft deleted
 * Params: none
 *  GET : users/get
 */
  public async getAllNotDeleted({ auth }: HttpContextContract) {
    const allNotDeleted = await User.findAllNotDeleted()
    return allNotDeleted
  }

  /*
 * new =  create a new user
 * Params: request, response
 */
  public async new({ request, response, auth }: HttpContextContract) {
    console.log(JSON.stringify(request.body()))
    const userPayLoad = await request.validate(CreateUserValidator)
    const user = await User.create(userPayLoad)
    console.log("user", user)
    return user
  }

  /**
    * FIND user by ID
    * Find User /users/:id
    */
  public async find({ params, auth, response }: HttpContextContract) {
    const user = await User.findNotDeleted(params.id);
    const sessionUser = auth.use('web').user!;
    if (!user || (!sessionUser.isAdmin && user.id !== sessionUser.id)) {
      return response.notFound({ message: 'User not found' });
    }
    return user
  }
  /*
   * update =  update by id
   * Params: request, response
   */

  public async update({ request, params, auth, response }: HttpContextContract) {

    const user = await User.findNotDeleted(params.id);
    const sessionUser = auth.use('web').user!;
    if (!user) {
      return response.notFound({ message: 'User not found' });
    }
    const userPayload = await request.validate(UpdateUserValidator);

    if (userPayload.is_admin && !sessionUser.isAdmin) {
      return response.unprocessableEntity({
        errors: [
          {
            field: 'is_admin',
            rule: 'invalid',
            message: "you are not authorized to modify this field",
          },
        ],
      });
    }
    await user.merge(userPayload).save();
    return user;

  }
//TODO 

  public async softDelete({ params }: HttpContextContract) {
    const user = await User.findOrFail(params.id)
    user.isDeleted = true
    await user.save()

    return user
  }
  /**
   * SET user to Admin by id
   * SET Admin /users/setAdmin/:id
   */
  public async setToAdmin({ params }: HttpContextContract) {
    const user = await User.findOrFail(params.id)
    user.isAdmin = true
    await user.save()

    return user
  }

  /**
 * DELETE user 
 * DELETE User /users/delete/:id
 */
  public async destroy({ params }: HttpContextContract) {
    const user = await User.findOrFail(params.id)
    await user.delete()

    return user
  }
 

}



