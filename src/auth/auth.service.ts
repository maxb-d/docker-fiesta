import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt'
import { Tokens } from './types/tokens.type';
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) {}

    async signupLocal(dto: AuthDto): Promise<Tokens> {
        const { username, email, password } = dto

        // Check for duplicate
        const foundUser = await this.prisma.user.findUnique({ where: { username }})

        if (foundUser) {
            throw new BadRequestException('Username already registered')
        }

        const hashedPassword = await this.hashData(password)

        const newUser = await this.prisma.user.create({ 
            data: {
                username,
                email,
                hashedPassword
            }
        })
        
        const tokens = await this.signTokens(newUser.id, newUser.username)
        await this.updateRtHash(newUser.id, tokens.refresh_token)

        return tokens
    }

    async signinLocal(dto: AuthDto): Promise<Tokens> {
        const { username, email, password } = dto

        const foundUser = await this.prisma.user.findUnique({ where: { username } })

        if (!foundUser) {
            throw new BadRequestException('Wrong credentials provided')
        }

        const passwordMatches = await bcrypt.compare( password, foundUser.hashedPassword )
        
        if (!passwordMatches) {
            throw new BadRequestException('Wrong credentials')
        }

        const tokens = await this.signTokens(foundUser.id, foundUser.username)
        await this.updateRtHash(foundUser.id, tokens.refresh_token)

        return tokens
    }

    async logout(userId: string) {
        await this.prisma.user.updateMany({
            where: {
                id: userId,
                hashedRt: {
                    not: null,
                },
            },
            data: {
                hashedRt: null
            }
        })
    }

    async refreshToken(userId: string, rt: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user || !user.hashedRt) {
            throw new BadRequestException('Access Denied')
        }

        const rtMatched = await bcrypt.compare(rt, user.hashedRt) 

        if (!rtMatched) throw new ForbiddenException('Access Denied')

        const tokens = await this.signTokens(user.id, user.username)
        await this.updateRtHash(user.id, tokens.refresh_token)

        return tokens
    }


    /**
     * UTILS FUNCTIONS
     */
    async hashData(data: string) {
        const saltOrRounds = 10;
    
        return await bcrypt.hash(data, saltOrRounds)
    }

    async signTokens(userId: string, username: string): Promise<Tokens> {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync({
                sub: userId,
                username
            }, {
                secret: process.env.AT_SECRET,
                expiresIn: 60 * 15,
            }),
            this.jwtService.signAsync({
                sub: userId,
                username
            }, {
                secret: process.env.RT_SECRET,
                expiresIn: 60 * 60 * 24 * 7,
            })
        ])

        return {
            access_token: at,
            refresh_token: rt
        }
    }

    async updateRtHash(userId: string, rt: string) {
        const hash = await this.hashData(rt)
        await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                hashedRt: hash,
            }
        })
    }
}
