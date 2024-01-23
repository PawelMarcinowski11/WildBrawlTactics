import { ActionTarget, ActionType, PlayerType } from '../enums';
import { Team } from '../enums/team';
import { ICharacter } from '../interfaces';

export class Skunk implements ICharacter {
  constructor(
    public x: number,
    public y: number,
    public timesUpgraded = 0,
    public player = PlayerType.AI,
    public team = Team.OPPONENT,
    public moved = false,
    public hp = 12,
    public maxHp = 12,
    public hpGrowth = 3,
    public appearance = 'u1f9a8',
    public statuses = [],
    public actions = [
      {
        name: 'Spread aroma',
        type: ActionType.DAMAGE,
        amount: 2,
        amountGrowth: 2,
        appearance: 'u1f4a8_mod_a',
        timesUpgraded: 0,
        target: ActionTarget.ALL_ENEMIES,
      },
    ],
    public id = crypto.randomUUID(),
  ) {
    if (this.timesUpgraded > 0) {
      this.hp += this.hpGrowth * this.timesUpgraded;
      this.maxHp += this.hpGrowth * this.timesUpgraded;

      this.actions.forEach((action) => {
        action.timesUpgraded = this.timesUpgraded;
        action.amount += action.amountGrowth * this.timesUpgraded;
      });
    }
  }
}
