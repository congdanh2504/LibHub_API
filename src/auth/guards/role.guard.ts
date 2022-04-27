import Role from './role.enum';
import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { Request } from 'express';
 
export interface IGetUserAuthInfoRequest extends Request {
  user: string 
}

const RoleGuard = (role: Role): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest<IGetUserAuthInfoRequest>();
        const user = request.user;
        return user['role']?.includes(role);
    }
  }
 
  return mixin(RoleGuardMixin);
}
 
export default RoleGuard;