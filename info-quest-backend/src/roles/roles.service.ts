// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Role } from './entities/role.entities';
// import { Repository } from 'typeorm';
// import { CreateRoleDto } from './dto/role.dto';
// import { UpdateRoleDto } from './dto/update-role.dto';
// import {
//   FilterOperator,
//   FilterSuffix,
//   paginate,
//   Paginated,
//   PaginateQuery,
// } from 'nestjs-paginate';
//
// @Injectable()
// export class RolesService {
//   constructor(
//     @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
//   ) {}
//
//   create(createRoleDto: CreateRoleDto) {
//     const newRole = this.roleRepository.create({ ...createRoleDto });
//
//     return this.roleRepository.save(newRole);
//   }
//
//   findAll(query: PaginateQuery): Promise<Paginated<Role>> {
//     return paginate(query, this.roleRepository, {
//       sortableColumns: ['id', 'name'],
//       searchableColumns: ['name'],
//       defaultSortBy: [['id', 'ASC']],
//       filterableColumns: {
//         name: [FilterOperator.EQ, FilterOperator.ILIKE],
//       },
//       relations: ['permissions'],
//       maxLimit: 100,
//     });
//   }
//
//   findOne(id: number) {
//     return this.roleRepository.findOne({
//       where: {
//         id,
//       },
//       relations: ['permissions'],
//     });
//   }
//
//   findOneByName(name: string) {
//     return this.roleRepository.findOne({
//       where: {
//         name,
//       },
//     });
//   }
//
//   async update(id: number, updateRoleDto: UpdateRoleDto) {
//     const role = await this.findOne(id);
//     return this.roleRepository.save({ ...role, ...updateRoleDto });
//   }
//
//   async deleteRole(id: number): Promise<void> {
//     await this.roleRepository.delete(id);
//   }
//
//   count() {
//     return this.roleRepository.count();
//   }
// }
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  FilterOperator,
  paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    try {
      const newRole = this.roleRepository.create(createRoleDto);
      return await this.roleRepository.save(newRole);
    } catch (error) {
      throw new Error(`Error creating role: ${error.message}`);
    }
  }

  async findAll(query: PaginateQuery): Promise<Paginated<Role>> {
    try {
      return await paginate(query, this.roleRepository, {
        sortableColumns: ['id', 'name'],
        searchableColumns: ['name'],
        defaultSortBy: [['id', 'ASC']],
        filterableColumns: {
          name: [FilterOperator.EQ, FilterOperator.ILIKE],
        },
        relations: ['permissions'],
        maxLimit: 100,
      });
    } catch (error) {
      throw new Error(`Error finding roles: ${error.message}`);
    }
  }

  async findOne(id: number): Promise<Role> {
    try {
      const role = await this.roleRepository.findOne({
        where: { id },
        relations: ['permissions'],
      });
      if (!role) {
        throw new NotFoundException(`Role with ID ${id} not found`);
      }
      return role;
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        throw new Error(`Error finding role with ID ${id}: ${error.message}`);
      }
      throw error;
    }
  }

  async findOneByName(name: string): Promise<Role> {
    try {
      const role = await this.roleRepository.findOne({
        where: { name },
      });
      if (!role) {
        throw new NotFoundException(`Role with name ${name} not found`);
      }
      return role;
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        throw new Error(
          `Error finding role with name ${name}: ${error.message}`,
        );
      }
      throw error;
    }
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    try {
      const role = await this.findOne(id); // This call includes NotFoundException handling
      return await this.roleRepository.save({ ...role, ...updateRoleDto });
    } catch (error) {
      throw new Error(`Error updating role with ID ${id}: ${error.message}`);
    }
  }

  async deleteRole(id: number): Promise<void> {
    try {
      const result = await this.roleRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Role with ID ${id} not found`);
      }
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        throw new Error(`Error deleting role with ID ${id}: ${error.message}`);
      }
      throw error;
    }
  }

  async count(): Promise<number> {
    try {
      return await this.roleRepository.count();
    } catch (error) {
      throw new Error(`Error counting roles: ${error.message}`);
    }
  }
}
