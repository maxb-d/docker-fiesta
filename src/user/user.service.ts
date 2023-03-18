import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Tokens } from '../auth/types/tokens.type';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService, private auth: AuthService) {}

    async updateUser(id: string, dto: UserDto): Promise<Tokens> {
        const user = await this.prisma.user.findUnique({ where: { id } })

        if (!user) {
            throw new NotFoundException()
        }

        user.username = dto.username ? dto.username : user.username
        user.email = dto.email ? dto.email : user.email
        user.hashedPassword = dto.password ? (
            await this.auth.hashData(dto.password)
        ) : (
            user.hashedPassword
        )
        
        console.log("New User = ", user)
        const updatedUser = await this.prisma.user.update(
            {
                where: { id },
                data: {
                    username: user.username,
                    email: user.email,
                    hashedPassword: user.hashedPassword,
                }
            }
        )
        console.log("updated user = ", updatedUser)
        
        const tokens = await this.auth.signTokens(user.id, user.username)
        await this.auth.updateRtHash(user.id, tokens.refresh_token)
        return tokens
    }

    async getUsers () {
        return await this.prisma.user.findMany({ select: {id: true, username: true}})
    }
}
