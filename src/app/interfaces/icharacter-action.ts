import { ActionTarget, ActionType } from '../enums';

export interface ICharacterAction {
  amount: number;
  amountGrowth: number;
  appearance: string;
  name: string;
  target: ActionTarget;
  timesUpgraded: number;
  type: ActionType;
  uses?: number;
  usesLeft?: number;
}
