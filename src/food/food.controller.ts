import { Controller, Get, Param } from '@nestjs/common';
import { FoodService } from './food.service';

@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get(':barcode')
  getFoodItem(@Param() params: { barcode: string }): any {
    return this.foodService.getFoodItem(params.barcode);
  }
}
