import { ActionTarget, ActionType, PlayerType } from '../enums';
import { Team } from '../enums/team';
import { ICharacter } from '../interfaces';

export class Bee implements ICharacter {
  constructor(
    public x: number,
    public y: number,
    public timesUpgraded = 0,
    public player = PlayerType.HUMAN,
    public team = Team.PLAYER,
    public moved = false,
    public hp = 10,
    public maxHp = 10,
    public hpGrowth = 3,
    public appearance = 'u1f41d',
    public statuses = [],
    public actions = [
      {
        name: 'Sting',
        type: ActionType.DAMAGE,
        amount: 3,
        amountGrowth: 2,
        appearance: 'u2694',
        timesUpgraded: 0,
        target: ActionTarget.ENEMY,
      },
      {
        name: 'Heal',
        type: ActionType.HEAL,
        amount: 10,
        amountGrowth: 5,
        appearance: 'u1fa79',
        timesUpgraded: 0,
        uses: 4,
        usesLeft: 4,
        target: ActionTarget.ALLY,
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
