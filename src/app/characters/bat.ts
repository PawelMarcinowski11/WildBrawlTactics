import { ActionTarget, ActionType, PlayerType } from '../enums';
import { Team } from '../enums/team';
import { ICharacter } from '../interfaces';

export class Bat implements ICharacter {
  constructor(
    public x: number,
    public y: number,
    public timesUpgraded = 0,
    public player = PlayerType.AI,
    public team = Team.OPPONENT,
    public moved = false,
    public hp = 8,
    public maxHp = 8,
    public hpGrowth = 3,
    public appearance = 'u1f987',
    public statuses = [],
    public actions = [
      {
        name: 'Bite',
        type: ActionType.DAMAGE,
        amount: 3,
        amountGrowth: 1,
        appearance: 'u2694',
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
