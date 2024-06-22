import { Get, Controller, Param, Post, Body, InternalServerErrorException, BadRequestException, ParseIntPipe, NotFoundException, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEntity } from './model/userEntity';
import { CreateUserDtos, UpdateUserDto, UserResponseDto } from './model/UserDtos';


@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<UserEntity[]> {
    try {
      return await this.userService.findAll();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Post()
  async createUser(@Body() user: CreateUserDtos): Promise<UserEntity> {
    try {
      return await this.userService.create(user);
    } catch (error) {
      throw error; // Assuming `this.userService.create(user)` throws BadRequestException
    }
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
    try {
      const user = await this.userService.findOne(id);
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      return user;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Put(':id')
  async updateUser(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateUserDto): Promise<UserEntity> {
    try {
      return await this.userService.update(id, updateDto);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<UserEntity> {
    try {
      const deletedUser = await this.userService.remove(parseInt(id));
      return deletedUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error; // Throw other exceptions for global exception handling
    }
  }
  @Post('login')
  async loginUser(@Body() credentials: { email: string; password: string }): Promise<{ accessToken: string }> {
    try {
      const jwtToken = await this.userService.logInUser(credentials.email, credentials.password);
      return { accessToken: jwtToken };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
