import { Injectable } from '@nestjs/common';
import { UsersService } from '../src/users/users.service';
import { RolesService } from '../src/roles/roles.service';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { CreatePermissionDto } from '../src/roles/dto/permission.dto';
import { PermissionsService } from '../src/roles/permissions/permissions.service';
import { Action } from '../src/roles/type/action.type';
import { CreateRoleDto } from '../src/roles/dto/role.dto';

@Injectable()
export class Seeder {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly permissionsService: PermissionsService,
  ) {}

  async run() {
    await this.seedRoles();
    await this.seedPermissions();
  }

  private async seedRoles() {
    if (!(await this.rolesService.count())) {
      const defaultRoles: CreateRoleDto[] = [
        { name: 'Super Admin' },
        { name: 'Admin' },
        { name: 'User' },
      ];

      for (const roleData of defaultRoles) {
        await this.rolesService.create(roleData);
      }
    }
  }

  private async seedPermissions() {
    const superAdminRole = await this.rolesService.findOneByName('Super Admin');
    const adminRole = await this.rolesService.findOneByName('Admin');
    const userRole = await this.rolesService.findOneByName('User');

    if (!(await this.permissionsService.count())) {
      const defaultPermissions: Array<CreatePermissionDto> = [
        {
          action: Action.Manage,
          subject: 'all',
          roles: [superAdminRole],
        },
        {
          action: Action.Manage,
          subject: 'User',
          roles: [adminRole],
        },
        {
          action: Action.Read,
          subject: 'Role',
          roles: [adminRole],
        },
        {
          action: Action.Read,
          subject: 'Permission',
          roles: [adminRole],
        },
        {
          action: Action.Manage,
          subject: 'Section',
          roles: [adminRole],
        },
        {
          action: Action.Manage,
          subject: 'Document',
          roles: [adminRole],
        },
        {
          action: Action.Read,
          subject: 'Section Teacher',
          roles: [adminRole],
        },
        {
          action: Action.Read,
          subject: 'Section Student',
          roles: [adminRole],
        },
        {
          action: Action.Read,
          subject: 'Section Secretary',
          roles: [adminRole],
        },
      ];

      for (const permissionData of defaultPermissions) {
        await this.permissionsService.create(permissionData);
      }
    }
  }
}
