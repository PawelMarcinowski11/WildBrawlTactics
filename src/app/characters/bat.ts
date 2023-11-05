import { ActionTarget, ActionType, PlayerType } from '../enums';
import { ICharacter } from '../interfaces';

export class Bat implements ICharacter {
  constructor(
    public x: number,
    public y: number,
    public timesUpgraded = 0,
    public player = PlayerType.AI,
    public team = 0,
    public moved = false,
    public hp = 10,
    public maxHp = 10,
    public hpGrowth = 3,
    public appearance = '🦇',
    public statuses = [],
    public actions = [
      {
        name: 'Bite',
        type: ActionType.DAMAGE,
        amount: 3,
        amountGrowth: 1,
        timesUpgraded: 0,
        target: ActionTarget.ENEMY,
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
