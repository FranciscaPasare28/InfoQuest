import {
  BadRequestException,
  Injectable,
  InternalServerErrorException, NotFoundException
} from "@nestjs/common";
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../roles/entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSecurityService } from './user-security.service';
import {
  FilterOperator,
  paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';
import { Permission } from "../roles/entities/permission.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    private readonly userSecurityService: UserSecurityService,
  ) {}

  async create(data: CreateUserDto): Promise<User> {
    try {
      const existingUser = await this.findOneByEmail(data.email);
      if (existingUser) {
        throw new BadRequestException('User with that email already exists.');
      }

      let role;
      if (data.roleId) {
        role = await this.roleRepository.findOneBy({ id: data.roleId });
        if (!role) {
          throw new BadRequestException('Role not found');
        }
      }

      const hashedPassword = await this.userSecurityService.hashSecret(
        data.password || 'defaultPassword',
      );
      const newUser = this.userRepository.create({
        ...data,
        role,
        password: hashedPassword,
        email: data.email.toLowerCase().trim(),
      });

      return await this.userRepository.save(newUser);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findUsersByPermission(permissionId: number): Promise<User[]> {
    const usersWithRoles = await this.userRepository.find({
      relations: ['role', 'role.permissions'], // Asigură-te că ai relațiile configurate corespunzător în entități
    });

    return usersWithRoles.filter(user =>
      user.role.permissions.some(permission => permission.id === permissionId)
    );
  }



  async findAll(query: PaginateQuery): Promise<Paginated<User>> {
    try {
      return await paginate(query, this.userRepository, {
        sortableColumns: ['id', 'name', 'email'],
        searchableColumns: ['name', 'email'],
        defaultSortBy: [['id', 'ASC']],
        filterableColumns: {
          name: [FilterOperator.EQ, FilterOperator.ILIKE],
          email: [FilterOperator.EQ, FilterOperator.ILIKE],
        },
        maxLimit: 50,
        relations: ['role'],
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findByName(name: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: {
        name: name.trim(),
      },
    });
  }
  async findAllVacations(): Promise<any> {
    const users = await this.userRepository.find(); // Ajustează în funcție de logica ta de repository
    const vacations = users.map((user) => ({
      userId: user.id,
      name: user.name,
      vacationDays: user.vacationDays,
      email: user.email,
    }));
    return vacations;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOneWithOptions(
      { id },
      {
        relations: ['role'],
      },
    );

    if (updateUserDto?.roleId && user?.role?.id !== updateUserDto?.roleId) {
      const role = await this.roleRepository.findOne({
        where: { id: updateUserDto.roleId },
      });

      if (!role) {
        throw new BadRequestException('Role not found', 'Bad request');
      }

      user.role = role;
    }
    delete updateUserDto.roleId;

    if (updateUserDto.password) {
      updateUserDto.password = await this.userSecurityService.hashSecret(
        updateUserDto.password,
      );
    }

    if (updateUserDto.email) {
      updateUserDto.email = updateUserDto.email.toLowerCase().trim();
    }

    return this.userRepository.save({
      ...user,
      ...updateUserDto,
    });
  }
  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOneBy({
        email: email.toLowerCase().trim(),
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id?: number): Promise<User | null> {
    try {
      return await this.userRepository.findOneBy({ id });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOneUserPermissions(userId: number): Promise<Permission[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role', 'role.permissions'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.role?.permissions || [];
  }


  async remove(id: number): Promise<void> {
    try {
      const user = await this.findOne(id);
      if (!user) {
        console.log(`User with ID ${id} not found`); // Logare pentru debugging
        throw new InternalServerErrorException(`User with ID ${id} not found`);
      }
      await this.userRepository.softRemove(user);
      console.log(`User with ID ${id} soft removed successfully`); // Logare pentru succes
    } catch (error) {
      console.error('Error during soft removal:', error); // Logare pentru debugging
      throw new InternalServerErrorException(error.message);
    }
  }
  async count(): Promise<number> {
    try {
      return await this.userRepository.count();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOneWithOptions(where: object, options: object): Promise<User> {
    try {
      return await this.userRepository.findOne({ where, ...options });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async addVacationDays(
    userId: number,
    vacationDates: string[],
  ): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Presupunând că există un câmp în entitatea User care stochează zilele de concediu
    // Verifică dacă utilizatorul are deja o listă de zile de concediu și actualizează-o
    if (!user.vacationDays) {
      user.vacationDays = [];
    }

    // Adaugă noile zile de concediu la lista existentă, evitând duplicatele
    vacationDates.forEach((vacationDate) => {
      if (!user.vacationDays.includes(vacationDate)) {
        user.vacationDays.push(vacationDate);
      }
    });

    // Salvează utilizatorul actualizat în baza de date
    await this.userRepository.save(user);

    return user;
  }
}
