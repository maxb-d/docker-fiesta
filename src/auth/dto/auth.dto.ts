import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class AuthDto {
    @IsNotEmpty()
    @IsString()
    public username: string

    @IsNotEmpty()
    @IsEmail()
    public email: string

    @IsNotEmpty()
    @IsString()
    @Length(3, 20, { message: 'Password has to be between 3 and 20 chars' })
    public password: string
}