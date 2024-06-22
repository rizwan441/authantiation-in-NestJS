import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength ,IsOptional} from 'class-validator';
import { BeforeInsert } from 'typeorm';
// import { PartialType } from '@nestjs/mapped-types';


export class CreateUserDtos{
    @IsNotEmpty()
    @IsString()
    readonly name: string;
  
    @IsNotEmpty()
    @IsEmail()
    @Exclude()
    readonly email: string;
  
    @IsNotEmpty()
    @IsString()
    readonly username: string;
  
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @Exclude()
   password: string;
  }



  export class UpdateUserDto {
    @IsOptional()
    @IsString()
    readonly name?: string;
  
    @IsOptional()
    @IsEmail()
     email?: string;
  
    @IsOptional()
    @IsString()
    readonly username?: string;
  
    @IsOptional()
    @IsString()
    @Exclude()
    @MinLength(6)
    readonly password?: string;

    @BeforeInsert()
    emailtoLowercase(){
      this.email=this.email.toLocaleLowerCase()
    }
  }

export class UserResponseDto {
  name: string;
  email: string;
}

