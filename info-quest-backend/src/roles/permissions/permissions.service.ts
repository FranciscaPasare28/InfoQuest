// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Permission } from '../entities/permission.entities';
// import { CreatePermissionDto } from '../dto/permission.dto';
// import { UpdatePermissionDto } from '../dto/update-permission.dto';
// import { paginate, PaginateQuery, Paginated, FilterOperator } from 'nestjs-paginate';
//
// @Injectable()
// export class PermissionsService {
//   constructor(
//     @InjectRepository(Permission)
//     private readonly permissionRepository: Repository<Permission>,
//   ) {}
//
//   async create(permissionData: CreatePermissionDto): Promise<Permission> {
//     try {
//       const newPermission = this.permissionRepository.create(permissionData);
//       return await this.permissionRepository.save(newPermission);
//     } catch (error) {
//       throw new Error(`Failed to create permission: ${error.message}`);
//     }
//   }
//
//   async findAll(query: PaginateQuery): Promise<Paginated<Permission>> {
//     try {
//       return await paginate(query, this.permissionRepository, {
//         sortableColumns: ['id', 'action', 'subject'],
//         searchableColumns: ['action', 'subject', 'roles.name'],
//         defaultSortBy: [['id', 'ASC']],
//         filterableColumns: {
//           'roles.id': [FilterOperator.EQ],
//           'roles.name': [FilterOperator.EQ, FilterOperator.ILIKE],
//         },
//         relations: ['roles'],
//         maxLimit: 100,
//       });
//     } catch (error) {
//       throw new Error(`Failed to retrieve permissions: ${error.message}`);
//     }
//   }
//
//   async update(id: number, updatePermissionDto: UpdatePermissionDto): Promise<Permission> {
//     try {
//       const permissionToUpdate = await this.permissionRepository.findOneBy({ id });
//       if (!permissionToUpdate) {
//         throw new Error(`Permission with ID ${id} not found`);
//       }
//       const updatedPermission = Object.assign(permissionToUpdate, updatePermissionDto);
//       return await this.permissionRepository.save(updatedPermission);
//     } catch (error) {
//       throw new Error(`Failed to update permission: ${error.message}`);
//     }
//   }
//
//   async findOne(id: number): Promise<Permission | null> {
//     try {
//       return await this.permissionRepository.findOneBy({ id });
//     } catch (error) {
//       throw new Error(`Failed to find permission: ${error.message}`);
//     }
//   }
//
//   async count(): Promise<number> {
//     try {
//       return await this.permissionRepository.count();
//     } catch (error) {
//       throw new Error(`Failed to count permissions: ${error.message}`);
//     }
//   }
// }
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';
import { CreatePermissionDto } from '../dto/permission.dto';
import { UpdatePermissionDto } from '../dto/update-permission.dto';
import {
  paginate,
  PaginateQuery,
  Paginated,
  FilterOperator,
} from 'nestjs-paginate';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async create(permissionData: CreatePermissionDto): Promise<Permission> {
    try {
      const newPermission = this.permissionRepository.create(permissionData);
      return await this.permissionRepository.save(newPermission);
    } catch (error) {
      throw new Error(`Failed to create permission: ${error.message}`);
    }
  }

  async findAll(query: PaginateQuery): Promise<Paginated<Permission>> {
    try {
      return await paginate(query, this.permissionRepository, {
        sortableColumns: ['id', 'action', 'subject'],
        searchableColumns: ['action', 'subject', 'roles.name'],
        defaultSortBy: [['id', 'ASC']],
        filterableColumns: {
          'roles.id': [FilterOperator.EQ],
          'roles.name': [FilterOperator.EQ, FilterOperator.ILIKE],
        },
        relations: ['roles'],
        maxLimit: 100,
      });
    } catch (error) {
      throw new Error(`Failed to retrieve permissions: ${error.message}`);
    }
  }

  async update(
    id: number,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    try {
      const permissionToUpdate = await this.permissionRepository.findOneBy({
        id,
      });
      if (!permissionToUpdate) {
        throw new Error(`Permission with ID ${id} not found`);
      }
      const updatedPermission = Object.assign(
        permissionToUpdate,
        updatePermissionDto,
      );
      return await this.permissionRepository.save(updatedPermission);
    } catch (error) {
      throw new Error(`Failed to update permission: ${error.message}`);
    }
  }

  async findOne(id: number): Promise<Permission | null> {
    try {
      return await this.permissionRepository.findOneBy({ id });
    } catch (error) {
      throw new Error(`Failed to find permission: ${error.message}`);
    }
  }

  async count(): Promise<number> {
    try {
      return await this.permissionRepository.count();
    } catch (error) {
      throw new Error(`Failed to count permissions: ${error.message}`);
    }
  }
}
