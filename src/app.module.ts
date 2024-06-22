import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users/model/userEntity';
import { UsersController } from './users/users.controller';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'asdf@1234',
        database: 'userAuth',
        entities: [UserEntity],
        synchronize: true, // NOTE: Do not use synchronize in production
      }),
    UsersModule,
    AuthModule],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule {}
