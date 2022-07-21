import UserLoginValidator from 'App/Validators/Users/UserLoginValidator';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import PassLostUserValidator from 'App/Validators/Users/PassLostUserValidator'
import { TokenTypes } from 'App/Contracts/enums'
import { DateTime } from 'luxon';
import PassLostPasswordTokenValidator from 'App/Validators/Users/PassLostPasswordTokenValidator'
import Token from 'App/Models/Token';
import User from 'App/Models/User';

export default class SecurityController {

  
  // public async login({ auth, request, response }: HttpContextContract) {
  //   const payload = await request.validate(UserLoginValidator);

  //   try {
  //     await auth.use('web').attempt(payload.email, payload.password);
  //     console.log('TEST LGIN',payload.email, payload.password );
      
  //     return response.json({ message: 'Login successful' });
  //   } catch (err) {
  //     return response.badRequest({
  //       code: err.code,
  //       message: 'Login failed',
  //     });
  //   }
  // }

  public async login({ auth, request, response }: HttpContextContract) {

    const payload = await request.validate(UserLoginValidator);
    const token = await auth.attempt(payload.email, payload.password)
    const user = auth.user!

    return response.ok({
      user: {
        token: token.token,
        ...user.serialize(),
      },
    })
  }
  /*
   * logout
   */
  public async logout({ auth }: HttpContextContract) {
    await auth.use('web').logout();
    return { message: 'Logout successful' };
  }
  /*
 * PassLost user 
 * PassLostUser /users/passLost/:id
 */
    public async passLostGenerateToken({ response, request }: HttpContextContract) {
      const emailPlayLoad = await request.validate(PassLostUserValidator)
      console.log('emailPlayLoad', emailPlayLoad)
      if (emailPlayLoad?.email) {
        const user = await User.findNotDeletedByEmail(emailPlayLoad.email)
        if (user) {
          console.log('user', user)
  
          const newToken = await Token.createSingleToken(TokenTypes.PASSLOST, user.id);
          console.log('newToken', newToken)
  
          if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
            return { token: newToken.token };
          }
        }
      }
      return response.noContent();
    }
  
    /*
     * passlost : consume token
     */
    public async passlostUpdate({ request, response }: HttpContextContract) {
      const payload = await request.validate(PassLostPasswordTokenValidator);
  
      // Ici on est sûr que le token est valide et que le compte = 1
      const tokenEntity = await Token.findBy('token', payload.token);
  
      // check de la validité du token (non faisable par les schémas de validation)
      if (tokenEntity && tokenEntity.validity_date > DateTime.now()) {
        const user = await User.findNotDeleted(tokenEntity?.userId);
  
        if (!user) {
          return response.unprocessableEntity({
            errors: [
              {
                field: 'token',
                rule: 'invalid',
                message: "token invalid, user doesnt exist",
              },
            ],
          });
        }
        user.password = payload.password;
        await user.save();
  
        // On mets à jour le password
        tokenEntity.count = 0;
        await tokenEntity.save();
        return response.noContent();
      }
  
      return response.unprocessableEntity({
        errors: [
          {
            field: 'token',
            rule: 'validity',
            message: 'token invalid',
          },
        ],
      });
    }
} 

