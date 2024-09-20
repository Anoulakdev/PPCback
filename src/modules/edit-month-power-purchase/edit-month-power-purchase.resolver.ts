import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { EditMonthPowerPurchaseService } from './edit-month-power-purchase.service';
import { EditMonthPowerPurchase } from './entities/edit-month-power-purchase.entity';
import { CreateEditMonthPowerPurchaseInput } from './dto/create-edit-month-power-purchase.input';
import { UpdateEditMonthPowerPurchaseInput } from './dto/update-edit-month-power-purchase.input';

@Resolver(() => EditMonthPowerPurchase)
export class EditMonthPowerPurchaseResolver {
  constructor(
    private readonly editMonthPowerPurchaseService: EditMonthPowerPurchaseService,
  ) {}

  // @Mutation(() => EditMonthPowerPurchase)
  // createEditMonthPowerPurchase(
  //   @Args('createEditMonthPowerPurchaseInput')
  //   createEditMonthPowerPurchaseInput: CreateEditMonthPowerPurchaseInput,
  // ) {
  //   return this.editMonthPowerPurchaseService.create(
  //     createEditMonthPowerPurchaseInput,
  //   );
  // }

  @Query(() => [EditMonthPowerPurchase], { name: 'editMonthPowerPurchase' })
  findAll() {
    return this.editMonthPowerPurchaseService.findAll();
  }

  @Query(() => EditMonthPowerPurchase, { name: 'editMonthPowerPurchase' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.editMonthPowerPurchaseService.findOne(id);
  }

  @Mutation(() => EditMonthPowerPurchase)
  updateEditMonthPowerPurchase(
    @Args('updateEditMonthPowerPurchaseInput')
    updateEditMonthPowerPurchaseInput: UpdateEditMonthPowerPurchaseInput,
  ) {
    return this.editMonthPowerPurchaseService.update(
      updateEditMonthPowerPurchaseInput.id,
      updateEditMonthPowerPurchaseInput,
    );
  }

  @Mutation(() => EditMonthPowerPurchase)
  removeEditMonthPowerPurchase(@Args('id', { type: () => Int }) id: number) {
    return this.editMonthPowerPurchaseService.remove(id);
  }
}
