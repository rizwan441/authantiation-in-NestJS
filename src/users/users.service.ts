import { Injectable, ConflictException, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './model/userEntity';
import { CreateUserDtos, UpdateUserDto } from './model/UserDtos';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly authservice: AuthService
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
      const hashpassword = await this.authservice.hashPasswordFun(createUserDto.password);
      createUserDto.password = hashpassword;
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
      const user = await this.userRepository.findOne({ where: { id } });
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
      const user = await this.userRepository.findOne({ where: { id } });
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
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.userRepository.remove(user);
    return user;
  }

  async logInUser(email: string, password: string): Promise<string> {
    const user = await this.validateUser(email, password);
    if (user) {
      const jwtKey = await this.authservice.generateJwtPassword(user);
      return jwtKey;
    } else {
      throw new HttpException(`Wrong credentials`, HttpStatus.UNAUTHORIZED);
    }
  }

  private async validateUser(email: string, password: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    const passwordMatch = await this.authservice.comparePasswordFun(password, user.password);
    if (passwordMatch) {
      return user;
    } else {
      throw new HttpException(`Wrong credentials`, HttpStatus.UNAUTHORIZED);
    }
  }
  async updateUserRole(id:number, user:UpdateUserDto){
    const  updatedUser=this.userRepository.update(id,user)

    return  updatedUser;

  }
}
