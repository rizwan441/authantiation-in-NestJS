import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDtos } from 'src/users/model/UserDtos';
const bcrypt = require("bcrypt")
 

@Injectable()
export class AuthService {
    constructor (private readonly jwtService:JwtService){}

     async generateJwtPassword(user:CreateUserDtos):Promise<any>{
        return this.jwtService.signAsync({user})

    }

    async hashPasswordFun(password:string):Promise<string>{
        return  (bcrypt.hash(password,12))
    }

    async comparePasswordFun(newpassword,hashpassword):Promise<boolean>{
        return (bcrypt.compare(newpassword,hashpassword))

    }
}
