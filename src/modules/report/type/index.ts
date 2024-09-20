import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Customer } from 'src/modules/customer/entities/customer.entity';

@ObjectType()
export class ResYesterday {
  @Field(() => Customer)
  customer: Customer;

  @Field(() => Int)
  asYesterday: number;
}
