import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FoodService } from './food.service';
import { FoodController } from './food.controller';

@Module({
  imports: [HttpModule],
  controllers: [FoodController],
  providers: [FoodService]
})
export class FoodModule {}
