import { IsEmail, IsNotEmpty, IsString, MinLength ,IsOptional} from 'class-validator';
// import { PartialType } from '@nestjs/mapped-types';


export class CreateUserDtos{
    @IsNotEmpty()
    @IsString()
    readonly name: string;
  
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;
  
    @IsNotEmpty()
    @IsString()
    readonly username: string;
  
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly password: string;
  }



  export class UpdateUserDto {
    @IsOptional()
    @IsString()
    readonly name?: string;
  
    @IsOptional()
    @IsEmail()
    readonly email?: string;
  
    @IsOptional()
    @IsString()
    readonly username?: string;
  
    @IsOptional()
    @IsString()
    @MinLength(6)
    readonly password?: string;
  }
