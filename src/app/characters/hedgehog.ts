import { ActionTarget, ActionType, PlayerType } from '../enums';
import { Team } from '../enums/team';
import { ICharacter } from '../interfaces';
import { Spiky } from '../statuses';

export class Hedgehog implements ICharacter {
  constructor(
    public x: number,
    public y: number,
    public timesUpgraded = 0,
    public player = PlayerType.HUMAN,
    public team = Team.PLAYER,
    public moved = false,
    public hp = 10,
    public maxHp = 10,
    public hpGrowth = 5,
    public appearance = 'u1f994',
    public statuses = [new Spiky()],
    public actions = [
      {
        name: 'Stab',
        type: ActionType.DAMAGE,
        amount: 2,
        amountGrowth: 1,
        appearance: 'u2694',
        timesUpgraded: 0,
        target: ActionTarget.ENEMY,
      },
      {
        name: 'Defensive stance',
        type: ActionType.DEFEND,
        amount: 1,
        amountGrowth: 0,
        appearance: 'u1f6e1',
        timesUpgraded: 0,
        uses: 3,
        usesLeft: 3,
        target: ActionTarget.SELF,
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
