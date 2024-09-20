import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { EditWeekPowerPurchaseService } from './edit-week-power-purchase.service';
import { EditWeekPowerPurchase } from './entities/edit-week-power-purchase.entity';
import { CreateEditWeekPowerPurchaseInput } from './dto/create-edit-week-power-purchase.input';
import { UpdateEditWeekPowerPurchaseInput } from './dto/update-edit-week-power-purchase.input';

@Resolver(() => EditWeekPowerPurchase)
export class EditWeekPowerPurchaseResolver {
  constructor(
    private readonly editWeekPowerPurchaseService: EditWeekPowerPurchaseService,
  ) {}

  // @Mutation(() => EditWeekPowerPurchase)
  // createEditWeekPowerPurchase(
  //   @Args('createEditWeekPowerPurchaseInput')
  //   createEditWeekPowerPurchaseInput: CreateEditWeekPowerPurchaseInput,
  // ) {
  //   return this.editWeekPowerPurchaseService.create(
  //     createEditWeekPowerPurchaseInput,
  //   );
  // }

  @Query(() => [EditWeekPowerPurchase], { name: 'editWeekPowerPurchase' })
  findAll() {
    return this.editWeekPowerPurchaseService.findAll();
  }

  @Query(() => EditWeekPowerPurchase, { name: 'editWeekPowerPurchase' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.editWeekPowerPurchaseService.findOne(id);
  }

  @Mutation(() => EditWeekPowerPurchase)
  updateEditWeekPowerPurchase(
    @Args('updateEditWeekPowerPurchaseInput')
    updateEditWeekPowerPurchaseInput: UpdateEditWeekPowerPurchaseInput,
  ) {
    return this.editWeekPowerPurchaseService.update(
      updateEditWeekPowerPurchaseInput.id,
      updateEditWeekPowerPurchaseInput,
    );
  }

  @Mutation(() => EditWeekPowerPurchase)
  removeEditWeekPowerPurchase(@Args('id', { type: () => Int }) id: number) {
    return this.editWeekPowerPurchaseService.remove(id);
  }
}
