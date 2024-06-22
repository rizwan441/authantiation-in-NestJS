import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './model/userEntity';
import { AuthModule } from 'src/auth/auth.module';
UserEntity

@Module({
  imports:[TypeOrmModule.forFeature([UserEntity]),AuthModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports:[UsersService]
})
export class UsersModule {}
