import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { Tokens } from '../auth/types/tokens.type';
import { AtGuard } from '../common/guards/at.guard';
import { RtGuard } from '../common/guards/rt.guard';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(RtGuard)
  @Post('/update/:id')
  updateUser(@Param() params: { id: string }, @Body() dto: UserDto): Promise<Tokens> {
    return this.userService.updateUser(params.id, dto)
  }
}
