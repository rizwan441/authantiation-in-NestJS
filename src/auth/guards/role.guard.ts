import { Injectable, CanActivate, ExecutionContext, Inject, forwardRef } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CreateUserDtos } from 'src/users/model/UserDtos';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return false;

    }
    const request = context.switchToHttp().getRequest();
    const user: CreateUserDtos = request.user.user;

    if (!user) {
      console.log('No user found, denying access.');
      return false; // No user means access denied
    }

    const userEntity = await this.userService.findOne(user.id);
    if (!userEntity) {
      console.log('User not found, denying access.');
      return false; // User not found means access denied
    }

    const hasRole = roles.includes(userEntity.role);
    console.log('User roles:', userEntity.role);
    console.log('Required roles:', roles);
    console.log('Has role:', hasRole);

    return hasRole; // Return true if the user has the required role, otherwise false
  }
}
