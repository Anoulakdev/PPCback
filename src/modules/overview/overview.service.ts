import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOverviewInput } from './dto/create-overview.input';
import { UpdateOverviewInput } from './dto/update-overview.input';
import { DayPowerPurchaseService } from '../day-power-purchase/day-power-purchase.service';
import { Message } from 'src/types';
import { DayPowerPurchase } from '../day-power-purchase/entities/day-power-purchase.entity';
import { SumDataByIndex } from 'src/shares/sum-data';
import { MainData } from './entities/main-data.entity';
import { Chart } from './entities/chart.entity';
import { QueryInput } from 'src/utils/query-input';
import { User } from '../user/entities/user.entity';

@Injectable()
export class OverviewService {
  constructor(
    private readonly dayPowerPurchaseService: DayPowerPurchaseService,
  ) {}
  async chart(user: User, queryInput?: QueryInput) {
    // console.log(queryInput);

    const data: DayPowerPurchase[] = await this.dayPowerPurchaseService.dayData(
      user,
      queryInput,
    );
    if (!data) return new BadRequestException(Message.getDataFail);

    const dispatchData = data.map((item) => {
      const power = item.powerDetail.map((detail) => detail.powers);

      const valueData = Array.from(Array(24), (_d, dIndex) => {
        const p: string[] = [];
        power.map((d) => {
          p.push(d[dIndex]);
        });
        if (p.length) {
          return p.reduce((a, b) => {
            return Number(a) + Number(b);
          }, 0);
        }
      });
      return valueData;
    });
    const declarationData = data.map((item) => {
      const power = item.originalDetail.details.map((detail) => detail.powers);

      const valueData = Array.from(Array(24), (_d, dIndex) => {
        const p: string[] = [];
        power.map((d) => {
          p.push(d[dIndex]);
        });
        if (p.length) {
          return p.reduce((a, b) => {
            return Number(a) + Number(b);
          }, 0);
        }
      });
      return valueData;
    });

    // console.log(sumDataByIndex(dispatchs));
    const declarations = declarationData.length
      ? SumDataByIndex(declarationData)
      : [];
    const dispatchs = dispatchData.length ? SumDataByIndex(dispatchData) : [];

    const results = [...declarations, ...dispatchs];
    const max = Math.max(...results);

    const newData: Chart = {
      labels: [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24,
      ],
      declarations,
      dispatchs,
      min: 0,
      max: max + 20,
    };

    return newData;
  }
}
