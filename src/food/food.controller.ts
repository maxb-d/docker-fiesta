import { 
  Controller, 
  Get, 
  Param,
  UseGuards
} from '@nestjs/common';
import { AtGuard } from '../common/guards/at.guard';
import { RtGuard } from '../common/guards/rt.guard';

import { FoodService } from './food.service';

@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @UseGuards(AtGuard)
  @Get(':barcode')
  async getFoodItem(@Param() params: { barcode: string }): Promise<any> {
    return await this.foodService.getFoodItem(params.barcode);
  }
}
