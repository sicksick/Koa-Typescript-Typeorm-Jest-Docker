import { Controller, Ctx, Get } from 'routing-controllers';
import CustomError from '../helpers/error';


@Controller('/api/users')
export class UserController {
  @Get('/:id')
  async getAll(@Ctx() ctx) {
    throw new CustomError(401, 'Unauthorized');
  }
}
