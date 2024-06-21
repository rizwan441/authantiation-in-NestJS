import { Injectable, ConflictException, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './model/userEntity';
import { CreateUserDtos, UpdateUserDto } from './model/UserDtos';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDtos): Promise<UserEntity> {
    try {
      // Check if username or email is already taken
      const existingUser = await this.userRepository.findOne({
        where: [
          { username: createUserDto.username },
          { email: createUserDto.email }
        ]
      });

      if (existingUser) {
        if (existingUser.username === createUserDto.username) {
          throw new ConflictException(`Username '${createUserDto.username}' is already taken`);
        } else {
          throw new ConflictException(`Email '${createUserDto.email}' is already registered`);
        }
      }

      const newUser = this.userRepository.create(createUserDto);
      return await this.userRepository.save(newUser);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(`Internal server error: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async findAll(): Promise<UserEntity[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw new HttpException(`Internal server error: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: number): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOneBy({id});
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(`Internal server error: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOneBy({id});
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      // Check if username or email is already taken by another user
      const existingUser = await this.userRepository.findOne({
        where: [
          { username: updateUserDto.username },
          { email: updateUserDto.email }
        ]
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException(`Username '${updateUserDto.username}' or email '${updateUserDto.email}' is already taken`);
      }

      Object.assign(user, updateUserDto);
      return await this.userRepository.save(user);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(`Internal server error: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }


  async remove(id: number): Promise<UserEntity> {
    // Check if the user exists
    const user = await this.userRepository.findOneBy({id});
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // Remove the user
    await this.userRepository.remove(user);
    return user;
  }
}

