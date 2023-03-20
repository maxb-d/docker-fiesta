import { Body, Controller, Param, Post, Get, UseGuards } from '@nestjs/common';
import { Tokens } from '../auth/types/tokens.type';
import { AtGuard } from '../common/guards/at.guard';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AtGuard)
  @Post('/update/:id')
  updateUser(@Param() params: { id: string }, @Body() dto: UserDto): Promise<Tokens> {
    return this.userService.updateUser(params.id, dto)
  }

  @Get()
  getUsers() {
    return this.userService.getUsers()
  }
}
