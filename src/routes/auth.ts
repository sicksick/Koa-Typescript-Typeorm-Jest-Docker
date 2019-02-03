import { joiValidate, userLoginSchema, userRegistrationSchema } from '../helpers/validator';
import { getManager, getRepository } from 'typeorm';
import { User } from '../entity/user';
import { Group } from '../entity/group';
import { Body, Controller, Post } from 'routing-controllers';
import CustomError from '../helpers/error';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

@Controller('/users')
export class UserController {

  @Post('/registration')
  async registration(@Body() body: User) {
    const self: any = this;

    await joiValidate(body, userRegistrationSchema);
    const user: User = await getRepository(User).findOne({
      where: {
        email: body.email
      }
    });

    if (user) {
      throw new CustomError(403, 'User is exist');
    }

    body.password = await bcrypt.hash(body.password, Number(process.env.BCRYPT_SALT_ROUNDS));

    return await getManager().transaction(async manager => {
      const user = manager.create(User, {
        email: body.email,
        password: body.password,
        groups: await manager.find(Group, {
          name: 'user',
        })
      });

      await manager.save(user);
      const {newUser, groups} = await UserController.trimUser(user);
      return {groups: groups, user: newUser, token: jwt.sign({user: user}, process.env.JWT_SECRET)};
    });
  }

  @Post('/login')
  async login(@Body() body: User) {
    await joiValidate(body, userLoginSchema);
    const user: User = await getRepository(User).findOne({
      where: {
        email: body.email
      },
      relations: ['groups']
    });

    if (!user || !await bcrypt.compare(body.password, user.password)) {
      throw new CustomError(401, 'Unauthorized');
    }
    const {newUser, groups} = await UserController.trimUser(user);
    return {groups: groups, user: newUser, token: jwt.sign({foo: 'bar'}, process.env.JWT_SECRET)};
  }

  private static async trimUser(user: User): Promise<{newUser: User, groups: string[]}> {
    delete user.password;
    delete user.facebook_id;
    delete user.google_id;
    delete user.updated_at;
    delete user.created_at;
    const groups = user.groups.map(group => group.name);
    delete user.groups;

    return {newUser: user, groups: groups};
  }

}
