import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { EditDayPowerPurchaseService } from './edit-day-power-purchase.service';
import { EditDayPowerPurchase } from './entities/edit-day-power-purchase.entity';
import { UpdateEditDayPowerPurchaseInput } from './dto/update-edit-day-power-purchase.input';

@Resolver(() => EditDayPowerPurchase)
export class EditDayPowerPurchaseResolver {
  constructor(
    private readonly editDayPowerPurchaseService: EditDayPowerPurchaseService,
  ) {}

  // @Mutation(() => EditDayPowerPurchase)
  // createEditDayPowerPurchase(
  //   @Args('createEditDayPowerPurchaseInput')
  //   createEditDayPowerPurchaseInput: CreateEditDayPowerPurchaseInput,
  // ) {
  //   return this.editDayPowerPurchaseService.create(
  //     createEditDayPowerPurchaseInput,
  //   );
  // }

  @Query(() => [EditDayPowerPurchase], { name: 'editDayPowerPurchase' })
  findAll() {
    return this.editDayPowerPurchaseService.findAll();
  }

  @Query(() => EditDayPowerPurchase, { name: 'editDayPowerPurchase' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.editDayPowerPurchaseService.findOne(id);
  }

  @Mutation(() => EditDayPowerPurchase)
  updateEditDayPowerPurchase(
    @Args('updateEditDayPowerPurchaseInput')
    updateEditDayPowerPurchaseInput: UpdateEditDayPowerPurchaseInput,
  ) {
    return this.editDayPowerPurchaseService.update(
      updateEditDayPowerPurchaseInput.id,
      updateEditDayPowerPurchaseInput,
    );
  }

  @Mutation(() => EditDayPowerPurchase)
  removeEditDayPowerPurchase(@Args('id', { type: () => Int }) id: number) {
    return this.editDayPowerPurchaseService.remove(id);
  }
}
