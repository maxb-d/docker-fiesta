import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators'

@Injectable()
export class FoodService {
    constructor(private httpService: HttpService) {}

    getFoodItem(barcode: string): any {
        return this.httpService
            .get(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`)
            .pipe(
                map((response) => response.data),
                map((data) => data)
            )
    }
}
