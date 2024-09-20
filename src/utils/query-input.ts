import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
class Pageginate {
  @Field(() => Int, { defaultValue: 0 })
  page?: number;
  @Field(() => Int, { defaultValue: 0 })
  limit?: number;
}
@InputType()
class DateFillter {
  @Field()
  startDate: string;

  @Field()
  endDate: string;
}

@InputType()
class Search {
  @Field(() => [String], { nullable: 'itemsAndList' })
  searchField?: string[];

  @Field({ nullable: true })
  q?: string;
}
@InputType()
class Condition {
  @Field({ nullable: true })
  field?: string;

  @Field({ nullable: true })
  value?: string;
}

@InputType()
export class QueryInput {
  @Field(() => [Condition], { nullable: 'itemsAndList' })
  condition?: Condition[];

  @Field(() => Pageginate, { nullable: true })
  pageginate?: Pageginate;

  @Field(() => Search, { nullable: true })
  search?: Search;

  @Field(() => DateFillter, { nullable: true })
  dateFillter?: DateFillter;

  @Field(() => Int, { defaultValue: -1 })
  sort?: number;

  @Field(() => Boolean, { nullable: true })
  join?: boolean;

  @Field(() => [String], { nullable: true })
  populate?: string[];
}
