import { HttpService } from '@nestjs/axios';
import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class FoodService {
    constructor(
        private httpService: HttpService,
        @Inject(CACHE_MANAGER) private cacheService: Cache,
    ) {}

    async getFoodItem(barcode: string): Promise<any> {
        // Check if data is in cache
        const cachedData = await this.cacheService.get<{ code: string }>(
            barcode.toString()
        )
        if (cachedData) {
            console.log('Getting data from cache')
            return `${cachedData.code}`
        }

        const { data } = await this.httpService.axiosRef.get(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`)
        await this.cacheService.set(barcode.toString(), data)

        return await `${data.code}`
    }
}
