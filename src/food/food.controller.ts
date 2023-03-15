import { 
  Controller, 
  Get, 
  Param
} from '@nestjs/common';

import { FoodService } from './food.service';

@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get(':barcode')
  async getFoodItem(@Param() params: { barcode: string }): Promise<any> {
    return await this.foodService.getFoodItem(params.barcode);
  }
}
