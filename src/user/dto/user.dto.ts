import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class UserDto {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    public username?: string

    @IsOptional()
    @IsNotEmpty()
    @IsEmail()
    public email?: string

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @Length(3, 20, { message: 'Password has to be between 3 and 20 chars' })
    public password?: string
}