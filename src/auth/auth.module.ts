import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { RolesGuard } from './guards/role.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { JwtStrategy } from './guards/jwt.strategy';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    forwardRef(()=>UsersModule), 
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret:configService.get("SecretKey") ,
        signOptions: { expiresIn: '10000s' },
    
      }),
    }),
  ],
  providers: [AuthService, RolesGuard,JwtAuthGuard,JwtStrategy],
  exports:[AuthService]
})
export class AuthModule {}

