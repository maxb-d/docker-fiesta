import { Module, CacheModule } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FoodService } from './food.service';
import { FoodController } from './food.controller';
import * as redisStore from 'cache-manager-redis-store'

@Module({
  imports: [
    HttpModule,
    CacheModule.register({
      isGlobal: true,
      ttl: 2,
      store: redisStore,
      url: "redis://localhost:6379",
    }),
  ],
  controllers: [FoodController],
  providers: [FoodService]
})
export class FoodModule {}
